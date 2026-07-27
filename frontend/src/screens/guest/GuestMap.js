import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { publicService } from '../../services/publicService';
import CtaModal from '../../components/ui/CtaModal';
import { colors, typography, spacing } from '../../theme';

const INITIAL_REGION = { latitude: -0.948, longitude: -80.716, latitudeDelta: 0.12, longitudeDelta: 0.12 };
const LINE_COLORS = ['#8e44ad', '#d35400', '#2980b9', '#27ae60', '#e74c3c'];

export default function GuestMap() {
  const [lines, setLines] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [direction, setDirection] = useState('all');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLoc({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
    publicService.getLines()
      .then((r) => setLines(r.data.data || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visibleLines = selectedLineId ? lines.filter((l) => l.id === selectedLineId) : lines;

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
                  title={`${line.code}: ${s.name}`}
                  pinColor={color}
                />
              ))}
            </View>
          );
        })}
        {userLoc && <Marker coordinate={userLoc} title="Tu ubicación" pinColor="#3498DB" />}
      </MapView>

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

      <TouchableOpacity style={styles.ctaFloating} onPress={() => setCtaVisible(true)}>
        <Text style={styles.ctaFloatingText}>Ver buses en vivo</Text>
      </TouchableOpacity>

      <CtaModal visible={ctaVisible} onClose={() => setCtaVisible(false)} feature="El rastreo en vivo de buses" />
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
  ctaFloating: { position: 'absolute', bottom: 80, left: spacing.xl, right: spacing.xl, backgroundColor: '#000', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 6 },
  ctaFloatingText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
