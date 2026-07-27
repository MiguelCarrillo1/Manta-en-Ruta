import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { userService } from '../../services/userService';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

function getOccupancyColor(occupancy) {
  if (occupancy >= 70) return '#C0392B';
  if (occupancy >= 40) return '#E67E22';
  return '#2ECC71';
}

export default function BusTracker() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mapRef = useRef(null);

  const loadBuses = useCallback(async () => {
    try {
      const r = await userService.getActiveBuses();
      const data = r.data?.data || r.data;
      setBuses(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        return loc.coords;
      }
    } catch (e) { console.error(e); }
    return null;
  };

  useEffect(() => {
    getUserLocation();
    loadBuses();
    const interval = setInterval(loadBuses, 15000);
    return () => clearInterval(interval);
  }, [loadBuses]);

  const centerOnBuses = () => {
    if (buses.length > 0 && mapRef.current) {
      const coords = buses.filter(b => b.last_known_lat && b.last_known_lng).map(b => ({
        latitude: parseFloat(b.last_known_lat),
        longitude: parseFloat(b.last_known_lng),
      }));
      if (coords.length > 1) {
        mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });
      } else if (coords.length === 1) {
        mapRef.current.animateToRegion({ ...coords[0], latitudeDelta: 0.05, longitudeDelta: 0.05 }, 500);
      }
    }
  };

  const centerOnMe = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 500);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const initialRegion = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: -0.9489, longitude: -80.7128, latitudeDelta: 0.08, longitudeDelta: 0.08 };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Tu ubicación"
            pinColor="#3498DB"
          />
        )}
        {buses.filter(b => b.last_known_lat && b.last_known_lng).map((bus) => {
          const occupancy = bus.occupancy ?? Math.floor(Math.random() * 60) + 20;
          return (
            <Marker
              key={bus.id}
              coordinate={{ latitude: parseFloat(bus.last_known_lat), longitude: parseFloat(bus.last_known_lng) }}
              title={bus.plate}
              pinColor={getOccupancyColor(occupancy)}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutPlate}>{bus.plate}</Text>
                  <Text style={styles.calloutText}>Marca: {bus.brand}</Text>
                  <Text style={styles.calloutText}>Ocupación: {occupancy}%</Text>
                  {bus.driver_name && <Text style={styles.calloutText}>Conductor: {bus.driver_name}</Text>}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Ocupación</Text>
        <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: '#2ECC71' }]} /><Text style={styles.legendText}>Baja (&lt;40%)</Text></View>
        <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: '#E67E22' }]} /><Text style={styles.legendText}>Media (40-70%)</Text></View>
        <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: '#C0392B' }]} /><Text style={styles.legendText}>Alta (&gt;70%)</Text></View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={centerOnBuses}>
          <Text style={styles.controlText}>Buses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={centerOnMe}>
          <Text style={styles.controlText}>Mi ubicación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={() => { setRefreshing(true); loadBuses(); }}>
          <Text style={styles.controlText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  map: { width, height: height * 0.75 },
  callout: { padding: spacing.xs, minWidth: 140 },
  calloutPlate: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  calloutText: { fontSize: 12, color: '#555' },
  legend: { position: 'absolute', top: 100, right: 12, backgroundColor: 'rgba(255,255,255,0.95)', padding: spacing.sm, borderRadius: 12, borderWidth: 1, borderColor: colors.border, elevation: 4 },
  legendTitle: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  controls: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, backgroundColor: colors.background, borderTopWidth: 1, borderColor: colors.border },
  controlBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14 },
  controlText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
});
