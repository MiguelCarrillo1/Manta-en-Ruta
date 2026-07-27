import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { publicService } from '../../services/publicService';
import { driverService } from '../../services/driverService';
import { useAuthStore } from '../../store';
import { createSimulator } from '../../utils/routeSimulation';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');
const INITIAL_REGION = { latitude: -0.948, longitude: -80.716, latitudeDelta: 0.12, longitudeDelta: 0.12 };
const LINE_COLORS = ['#8e44ad', '#d35400'];

export default function DriverMap() {
  const [lines, setLines] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [direction, setDirection] = useState('all');
  const [simulator, setSimulator] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [nextStop, setNextStop] = useState(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const mapRef = useRef(null);
  const intervalRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    publicService.getLines()
      .then((r) => {
        const data = r.data.data || r.data || [];
        setLines(data);
        if (data.length > 0) {
          setSelectedLineId(data[0].id);
          const sim = createSimulator(data[0]);
          if (sim) setSimulator(sim);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectLine = useCallback((lineId) => {
    setSelectedLineId(lineId);
    const line = lines.find((l) => l.id === lineId);
    if (line) {
      const sim = createSimulator(line);
      setSimulator(sim);
      if (sim) {
        const first = sim.sequence[0];
        setCurrentPos({ latitude: parseFloat(first.latitude), longitude: parseFloat(first.longitude) });
      }
    }
    setDirection('all');
    setIsTransmitting(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [lines]);

  const startRoute = useCallback(() => {
    if (!simulator) { Alert.alert('Error', 'Selecciona una línea primero'); return; }
    if (!unitNumber.trim()) { Alert.alert('Error', 'Ingresa la unidad'); return; }
    setIsTransmitting(true);
    simulator.reset();
    const line = lines.find((l) => l.id === selectedLineId);
    const lineCode = line?.code || `LINEA_${selectedLineId}`;
    const did = driverId || user?.id || 'DRIVER_UNKNOWN';

    intervalRef.current = setInterval(() => {
      const result = simulator.tick();
      if (!result) return;
      setCurrentPos({ latitude: result.pos.lat, longitude: result.pos.lng });
      setBearing(result.bearing);
      setNextStop(result.nextStop);

      const payload = {
        driver_id: String(did),
        assigned_line: lineCode,
        unit_number: unitNumber.trim(),
        current_position: { lat: result.pos.lat, lng: result.pos.lng },
        bearing: result.bearing,
        current_status: result.nextStop ? 'EN_RUTA' : 'EN_PARADA',
      };

      driverService.updatePosition({
        latitude: String(result.pos.lat),
        longitude: String(result.pos.lng),
        speed: 25,
        heading: Math.round(result.bearing),
        recorded_at: new Date().toISOString(),
      }).catch(() => {});
    }, 3000);
  }, [simulator, selectedLineId, lines, unitNumber, driverId, user]);

  const stopRoute = useCallback(() => {
    setIsTransmitting(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (currentPos && mapRef.current) {
      mapRef.current.animateCamera({ center: currentPos, zoom: 14 }, { duration: 500 });
    }
  }, [currentPos]);

  const selectedLine = lines.find((l) => l.id === selectedLineId);
  const idaStops = (selectedLine?.stops || []).filter((s) => s.tramo === 'ida').sort((a, b) => (a.order || 0) - (b.order || 0));
  const retStops = (selectedLine?.stops || []).filter((s) => s.tramo === 'regreso').sort((a, b) => (a.order || 0) - (b.order || 0));
  const allRouteStops = [...idaStops, ...retStops];
  const lineCode = selectedLine?.code || selectedLine?.name || '';

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      {showSetup && (
        <View style={styles.setupOverlay}>
          <View style={styles.setupCard}>
            <Text style={styles.setupTitle}>Configuración de Ruta</Text>
            <TouchableOpacity style={styles.setupField} onPress={() => {
              const idx = lines.findIndex((l) => l.id === selectedLineId);
              const next = lines[(idx + 1) % lines.length];
              if (next) selectLine(next.id);
            }}>
              <Text style={styles.setupLabel}>Línea</Text>
              <Text style={styles.setupValue}>{selectedLine?.name || 'Seleccionar'}  ▾</Text>
            </TouchableOpacity>
            <Text style={styles.setupLabel}>Unidad</Text>
            <TextInput
              style={styles.setupInput}
              placeholder="Ej: BUS-045"
              placeholderTextColor="#999"
              value={unitNumber}
              onChangeText={setUnitNumber}
            />
            <TouchableOpacity style={styles.startBtn} onPress={() => { setShowSetup(false); }}>
              <Text style={styles.startBtnText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation={false}>
        {direction === 'all' && allRouteStops.length >= 2 && (
          <Polyline
            coordinates={allRouteStops.map((s) => ({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }))}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}
        {(direction === 'all' || direction === 'ida') && idaStops.length >= 2 && (
          <Polyline
            coordinates={idaStops.map((s) => ({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }))}
            strokeColor={LINE_COLORS[0]}
            strokeWidth={direction === 'ida' ? 5 : 3}
          />
        )}
        {(direction === 'all' || direction === 'regreso') && retStops.length >= 2 && (
          <Polyline
            coordinates={retStops.map((s) => ({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }))}
            strokeColor={LINE_COLORS[0] + '80'}
            strokeWidth={direction === 'regreso' ? 5 : 3}
            lineDashPattern={direction === 'all' ? [] : [8, 4]}
          />
        )}
        {Object.values(
          allRouteStops.reduce((acc, s) => {
            if (!acc[s.id]) acc[s.id] = s;
            return acc;
          }, {})
        ).map((s) => (
          <Marker
            key={`s-${s.id}`}
            coordinate={{ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }}
            title={s.name}
            pinColor={s.tramo === 'regreso' ? '#f5a623' : LINE_COLORS[0]}
          />
        ))}
        {nextStop && (
          <Marker
            key="next-stop"
            coordinate={{ latitude: parseFloat(nextStop.latitude), longitude: parseFloat(nextStop.longitude) }}
            title={`Siguiente: ${nextStop.name}`}
            pinColor="#2ECC71"
          />
        )}
        {currentPos && (
          <Marker coordinate={currentPos} title={`${lineCode} - ${unitNumber}`} pinColor="#C0392B" flat anchor={{ x: 0.5, y: 0.5 }}>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Tu Bus</Text>
                <Text style={styles.calloutText}>Rumbo: {Math.round(bearing)}°</Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>

      <View style={styles.topBar}>
        <View style={styles.lineSelector}>
          {lines.map((l) => (
            <TouchableOpacity
              key={l.id}
              style={[styles.lineChip, selectedLineId === l.id && styles.lineChipActive]}
              onPress={() => selectLine(l.id)}
            >
              <Text style={[styles.lineChipText, selectedLineId === l.id && styles.lineChipTextActive]}>
                {l.code || l.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.dirRow}>
          {['all', 'ida', 'regreso'].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dirChip, direction === d && styles.dirChipActive]}
              onPress={() => setDirection(d)}
            >
              <Text style={[styles.dirChipText, direction === d && styles.dirChipTextActive]}>
                {d === 'all' ? 'Todo' : d === 'ida' ? 'Ida' : 'Regreso'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusLabel}>Unidad</Text>
          <Text style={styles.statusValue}>{unitNumber || '—'}</Text>
        </View>
        <View style={styles.statusCenter}>
          <Text style={styles.statusLabel}>Rumbo</Text>
          <Text style={styles.statusValue}>{Math.round(bearing)}°</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.statusLabel}>Estado</Text>
          <Text style={[styles.statusValue, isTransmitting && { color: '#2ECC71' }]}>
            {isTransmitting ? 'EN RUTA' : 'DETENIDO'}
          </Text>
        </View>
      </View>

      {nextStop && (
        <View style={styles.nextStopCard}>
          <Text style={styles.nextStopLabel}>SIGUIENTE PARADA</Text>
          <Text style={styles.nextStopName}>{nextStop.name}</Text>
        </View>
      )}

      <View style={styles.controls}>
        {!isTransmitting ? (
          <TouchableOpacity style={styles.startRouteBtn} onPress={startRoute}>
            <Text style={styles.startRouteBtnText}>Iniciar Ruta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopRouteBtn} onPress={stopRoute}>
            <Text style={styles.stopRouteBtnText}>Detener Ruta</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  map: { width, height: height - 200 },
  callout: { padding: spacing.xs, minWidth: 100 },
  calloutTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  calloutText: { fontSize: 12, color: '#555' },
  topBar: { position: 'absolute', top: 50, left: spacing.sm, right: spacing.sm, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: spacing.sm, elevation: 6, borderWidth: 1, borderColor: '#E6E6E6' },
  lineSelector: { flexDirection: 'row', marginBottom: spacing.sm, gap: spacing.sm },
  lineChip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#F0F0F0' },
  lineChipActive: { backgroundColor: '#000' },
  lineChipText: { fontSize: 14, color: '#555', fontWeight: '600' },
  lineChipTextActive: { color: '#FFF' },
  dirRow: { flexDirection: 'row', gap: spacing.sm },
  dirChip: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8, backgroundColor: '#F0F0F0' },
  dirChipActive: { backgroundColor: '#333' },
  dirChipText: { fontSize: 12, color: '#555', fontWeight: '500' },
  dirChipTextActive: { color: '#FFF' },
  statusBar: { position: 'absolute', top: 120, left: spacing.sm, right: spacing.sm, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: spacing.sm, elevation: 4, borderWidth: 1, borderColor: '#E6E6E6' },
  statusLeft: { flex: 1, alignItems: 'center' },
  statusCenter: { flex: 1, alignItems: 'center' },
  statusRight: { flex: 1, alignItems: 'center' },
  statusLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  nextStopCard: { position: 'absolute', bottom: 90, left: spacing.xl, right: spacing.xl, backgroundColor: '#000', borderRadius: 14, padding: spacing.md, alignItems: 'center', elevation: 8 },
  nextStopLabel: { fontSize: 10, color: '#AAA', letterSpacing: 1, textTransform: 'uppercase' },
  nextStopName: { fontSize: 16, color: '#FFF', fontWeight: '700', marginTop: spacing.xs },
  controls: { position: 'absolute', bottom: 20, left: spacing.xl, right: spacing.xl },
  startRouteBtn: { height: 52, backgroundColor: '#2ECC71', borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  startRouteBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  stopRouteBtn: { height: 52, backgroundColor: '#C0392B', borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  stopRouteBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  setupOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: spacing.xl },
  setupCard: { backgroundColor: '#FFF', borderRadius: 20, padding: spacing.xl, width: '100%', maxWidth: 340 },
  setupTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: spacing.lg },
  setupField: { marginBottom: spacing.md },
  setupInput: { height: 44, borderBottomWidth: 1, borderBottomColor: '#E6E6E6', fontSize: 16, fontWeight: '600', paddingVertical: spacing.sm, marginBottom: spacing.lg, color: '#000' },
  setupLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  setupValue: { fontSize: 16, fontWeight: '600', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#E6E6E6' },
  startBtn: { height: 50, backgroundColor: '#000', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  startBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
