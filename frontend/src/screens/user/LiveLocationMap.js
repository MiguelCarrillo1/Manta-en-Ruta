import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { userService } from '../../services/userService';

const INITIAL_REGION = { latitude: -0.948, longitude: -80.716, latitudeDelta: 0.04, longitudeDelta: 0.04 };
const PROXIMITY = 1000;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LiveLocationMap() {
  const [location, setLocation] = useState(null);
  const [buses, setBuses] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [nearbyIds, setNearbyIds] = useState([]);
  const mapRef = useRef(null);
  const notifiedRef = useRef(new Set());
  const locationRef = useRef(null);
  const busesRef = useRef([]);

  const checkProximity = useCallback((loc, busList) => {
    const nearby = [];
    busList.filter((b) => b.last_known_lat && b.last_known_lng).forEach((b) => {
      const d = haversine(loc.latitude, loc.longitude, parseFloat(b.last_known_lat), parseFloat(b.last_known_lng));
      if (d < PROXIMITY) {
        nearby.push(b.id);
        if (!notifiedRef.current.has(b.id)) {
          notifiedRef.current.add(b.id);
          Alert.alert('🚌 Bus cercano', `${b.plate} — ${b.driver_name || ''} está a ${Math.round(d)}m de ti`);
        }
      }
    });
    setNearbyIds(nearby);
  }, []);

  const fetchBuses = useCallback(() => {
    userService.getActiveBuses().then((r) => {
      const data = r.data.data || r.data || [];
      busesRef.current = data;
      setBuses(data);
      if (locationRef.current) checkProximity(locationRef.current, data);
    }).catch(() => {});
  }, [checkProximity]);

  const updateLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const pos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    locationRef.current = pos;
    setLocation(pos);
    setAccuracy(loc.coords.accuracy);
    checkProximity(pos, busesRef.current);
  }, [checkProximity]);

  useEffect(() => {
    updateLocation();
    fetchBuses();
    const locInterval = setInterval(updateLocation, 30000);
    const busInterval = setInterval(fetchBuses, 10000);
    return () => { clearInterval(locInterval); clearInterval(busInterval); };
  }, []);

  const activeBuses = buses.filter((b) => b.last_known_lat && b.last_known_lng);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation={false} showsCompass>
        {location && (
          <>
            <Marker coordinate={location} title="Tú estás aquí">
              <View style={styles.myMarker}>
                <View style={styles.myMarkerInner} />
              </View>
            </Marker>
            <Circle center={location} radius={accuracy || 50} strokeColor="rgba(0,0,0,0.12)" fillColor="rgba(0,0,0,0.04)" />
          </>
        )}
        {activeBuses.map((b) => (
          <Marker
            key={`bus-${b.id}`}
            coordinate={{ latitude: parseFloat(b.last_known_lat), longitude: parseFloat(b.last_known_lng) }}
            title={`${b.plate} — ${b.driver_name || ''}`}
            description={b.line_name || ''}
            pinColor="#000"
          />
        ))}
      </MapView>

      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Buses en tiempo real</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{activeBuses.length}</Text>
            <Text style={styles.infoLabel}>Buses activos</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : '—'}</Text>
            <Text style={styles.infoLabel}>Mi ubicación</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => { updateLocation(); fetchBuses(); }}>
            <Text style={styles.refreshText}>⟳</Text>
          </TouchableOpacity>
        </View>
        {nearbyIds.length > 0 && (
          <View style={styles.nearbyBadge}>
            <Text style={styles.nearbyText}>🚌 {nearbyIds.length} bus{nearbyIds.length > 1 ? 'es' : ''} cerca de ti</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  topBar: { position: 'absolute', top: 50, left: 20, right: 20, alignItems: 'center' },
  topTitle: { fontSize: 15, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  myMarker: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  myMarkerInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#000' },
  infoCard: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoItem: { flex: 1, alignItems: 'center' },
  infoValue: { fontSize: 15, fontWeight: '700' },
  infoLabel: { fontSize: 10, color: '#888', marginTop: 2 },
  infoDivider: { width: 1, height: 30, backgroundColor: '#E8E8E8', marginHorizontal: 8 },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  refreshText: { fontSize: 20, color: '#FFF' },
  nearbyBadge: { backgroundColor: '#000', borderRadius: 10, paddingVertical: 6, paddingHorizontal: spacing.md, marginTop: 10, alignItems: 'center' },
  nearbyText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});
