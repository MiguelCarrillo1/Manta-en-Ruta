import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { publicService } from '../services/publicService';
import { userService } from '../services/userService';
import { colors, typography, spacing } from '../theme';

const INITIAL_REGION = { latitude: -0.948, longitude: -80.716, latitudeDelta: 0.12, longitudeDelta: 0.12 };
const LINE_COLORS = ['#8e44ad', '#d35400', '#2980b9', '#27ae60', '#e74c3c'];
const PROXIMITY_THRESHOLD = 1000;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapScreen() {
  const [lines, setLines] = useState([]);
  const [buses, setBuses] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [direction, setDirection] = useState('all');
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [distance, setDistance] = useState(null);

  const fetchBuses = useCallback(() => {
    userService.getActiveBuses().then((r) => {
      const newBuses = r.data.data || r.data || [];
      setBuses(newBuses);
      if (selectedBusId) {
        const bus = newBuses.find((b) => b.id === selectedBusId);
        if (bus && userLoc) {
          const d = haversine(userLoc.latitude, userLoc.longitude, parseFloat(bus.last_known_lat), parseFloat(bus.last_known_lng));
          setDistance(d);
          if (d < PROXIMITY_THRESHOLD) {
            Alert.alert('¡Bus cercano!', `El bus ${bus.plate} está a ${Math.round(d)}m de ti`);
          }
        }
      }
    }).catch(() => {});
  }, [selectedBusId, userLoc]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLoc({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
    Promise.all([
      publicService.getLines().then((r) => setLines(r.data.data || r.data || [])).catch(() => {}),
      fetchBuses(),
    ]).finally(() => setLoading(false));
    const interval = setInterval(fetchBuses, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedBusId && userLoc) fetchBuses();
  }, [selectedBusId, userLoc]);

  const handleSelectBus = (bus) => {
    if (selectedBusId === bus.id) {
      setSelectedBusId(null);
      setDistance(null);
    } else {
      setSelectedBusId(bus.id);
      if (userLoc) {
        const d = haversine(userLoc.latitude, userLoc.longitude, parseFloat(bus.last_known_lat), parseFloat(bus.last_known_lng));
        setDistance(d);
      }
    }
  };

  const visibleLines = selectedLineId ? lines.filter((l) => l.id === selectedLineId) : lines;
  const selectedBus = buses.find((b) => b.id === selectedBusId);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} /></View>;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation>
        {visibleLines.map((line, li) => {
          const allStops = (line.stops || []).filter((s) => s.latitude && s.longitude);
          const idaStops = allStops.filter((s) => s.tramo === 'ida');
          const retStops = allStops.filter((s) => s.tramo === 'regreso');
          const color = LINE_COLORS[li % LINE_COLORS.length];
          const polylineKey = `poly-${direction}-${line.id}`;
          return (
            <View key={`line-${line.id}`}>
              {(direction === 'all' || direction === 'ida') && idaStops.length >= 2 && (
                <Polyline
                  key={`${polylineKey}-ida`}
                  coordinates={idaStops.map((s) => ({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }))}
                  strokeColor={color}
                  strokeWidth={4}
                />
              )}
              {(direction === 'all' || direction === 'regreso') && retStops.length >= 2 && (
                <Polyline
                  key={`${polylineKey}-regreso`}
                  coordinates={retStops.map((s) => ({ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }))}
                  strokeColor={color + '80'}
                  strokeWidth={4}
                  lineDashPattern={[8, 4]}
                />
              )}
              {Object.values(
                allStops.reduce((acc, s) => {
                  if (!acc[s.id]) acc[s.id] = s;
                  return acc;
                }, {})
              ).filter((s) => direction === 'all' || s.tramo === direction).map((s) => (
                <Marker
                  key={`${line.id}-s${s.id}`}
                  coordinate={{ latitude: parseFloat(s.latitude), longitude: parseFloat(s.longitude) }}
                  title={`${line.code || line.name}: ${s.name}`}
                  pinColor={color}
                />
              ))}
            </View>
          );
        })}
        {buses.filter((b) => b.last_known_lat && b.last_known_lng).map((b) => (
          <Marker
            key={`bus-${b.id}`}
            coordinate={{ latitude: parseFloat(b.last_known_lat), longitude: parseFloat(b.last_known_lng) }}
            title={`${b.plate} - ${b.driver_name || ''}`}
            pinColor={selectedBusId === b.id ? '#FFD700' : '#000'}
            onPress={() => handleSelectBus(b)}
          />
        ))}
        {userLoc && <Marker coordinate={userLoc} title="Tu ubicación" pinColor="#C0392B" />}
      </MapView>

      {selectedBus && (
        <View style={styles.busCard}>
          <View style={styles.busCardRow}>
            <View style={styles.busCardInfo}>
              <Text style={styles.busCardPlate}>{selectedBus.plate}</Text>
              <Text style={styles.busCardLine}>{selectedBus.line_name || ''}</Text>
              <Text style={styles.busCardDriver}>{selectedBus.driver_name || ''}</Text>
            </View>
            <View style={styles.busCardDist}>
              <Text style={styles.busCardDistValue}>{distance !== null ? `${Math.round(distance)}m` : '—'}</Text>
              <Text style={styles.busCardDistLabel}>distancia</Text>
            </View>
            <TouchableOpacity onPress={() => { setSelectedBusId(null); setDistance(null); }}>
              <Text style={styles.busCardClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {distance !== null && distance < PROXIMITY_THRESHOLD && (
            <View style={styles.proximityBadge}>
              <Text style={styles.proximityText}>🚌 ¡El bus está cerca!</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lineScroll}>
          <TouchableOpacity style={[styles.lineChip, !selectedLineId && styles.lineChipActive]} onPress={() => setSelectedLineId(null)}>
            <Text style={[styles.lineChipText, !selectedLineId && styles.lineChipTextActive]}>Todas</Text>
          </TouchableOpacity>
          {lines.map((l) => (
            <TouchableOpacity key={l.id} style={[styles.lineChip, selectedLineId === l.id && styles.lineChipActive]} onPress={() => setSelectedLineId(l.id)}>
              <Text style={[styles.lineChipText, selectedLineId === l.id && styles.lineChipTextActive]}>{l.code || l.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.dirRow}>
          {['all', 'ida', 'regreso'].map((d) => (
            <TouchableOpacity key={d} style={[styles.dirChip, direction === d && styles.dirChipActive]} onPress={() => setDirection(d)}>
              <Text style={[styles.dirChipText, direction === d && styles.dirChipTextActive]}>
                {d === 'all' ? 'Todo' : d === 'ida' ? 'Ida' : 'Regreso'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height - 120 },
  filterBar: { position: 'absolute', top: 50, left: spacing.sm, right: spacing.sm, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: spacing.sm, elevation: 6, borderWidth: 1, borderColor: '#E6E6E6' },
  lineScroll: { flexGrow: 0, marginBottom: spacing.sm },
  lineChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: spacing.sm },
  lineChipActive: { backgroundColor: '#000' },
  lineChipText: { fontSize: 13, color: '#555' },
  lineChipTextActive: { color: '#FFF', fontWeight: '600' },
  dirRow: { flexDirection: 'row', gap: spacing.sm },
  dirChip: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 10, backgroundColor: '#F0F0F0' },
  dirChipActive: { backgroundColor: '#000' },
  dirChipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  dirChipTextActive: { color: '#FFF', fontWeight: '600' },
  busCard: { position: 'absolute', bottom: 130, left: spacing.sm, right: spacing.sm, backgroundColor: '#FFF', borderRadius: 16, padding: spacing.md, elevation: 8, borderWidth: 1, borderColor: '#E6E6E6' },
  busCardRow: { flexDirection: 'row', alignItems: 'center' },
  busCardInfo: { flex: 1 },
  busCardPlate: { fontSize: 17, fontWeight: '700' },
  busCardLine: { fontSize: 13, color: '#555', marginTop: 2 },
  busCardDriver: { fontSize: 12, color: '#888', marginTop: 1 },
  busCardDist: { alignItems: 'center', marginHorizontal: spacing.md },
  busCardDistValue: { fontSize: 18, fontWeight: '700', color: '#000' },
  busCardDistLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase' },
  busCardClose: { fontSize: 18, color: '#888', paddingLeft: spacing.sm },
  proximityBadge: { backgroundColor: '#2ECC71', borderRadius: 10, paddingVertical: 6, paddingHorizontal: spacing.md, marginTop: spacing.sm, alignItems: 'center' },
  proximityText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});
