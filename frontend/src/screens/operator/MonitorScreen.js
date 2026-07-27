import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');
const INITIAL_REGION = { latitude: -0.948, longitude: -80.716, latitudeDelta: 0.12, longitudeDelta: 0.12 };

export default function MonitorScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadVehicles();
    const interval = setInterval(loadVehicles, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await api.get('/cooperative/monitoring/vehicles');
      const data = res.data.data || res.data || [];
      setVehicles(data);
    } catch {}
    finally { setLoading(false); }
  };

  const active = vehicles.filter((v) => v.latitude && v.longitude && v.active_journey);

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION}>
        {active.map((v) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }}
            title={`${v.plate}`}
            pinColor={v.status === 'in_journey' ? '#2ECC71' : '#C0392B'}
            onPress={() => setSelected(v)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{v.plate}</Text>
                <Text style={styles.calloutText}>Conductor: {v.active_journey?.driver?.full_name || '—'}</Text>
                <Text style={styles.calloutText}>Línea: {v.line?.name || '—'}</Text>
                <Text style={styles.calloutText}>AC: {v.ac_status ? 'ON' : 'OFF'} | WiFi: {v.wifi_status ? 'ON' : 'OFF'}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selected && (
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>{selected.plate}</Text>
          <Text style={styles.infoText}>Conductor: {selected.active_journey?.driver?.full_name || '—'}</Text>
          <Text style={styles.infoText}>Línea: {selected.line?.name || '—'}</Text>
          <Text style={styles.infoText}>Km inicio: {selected.active_journey?.start_km || '—'}</Text>
          <Text style={styles.infoText}>Inicio: {selected.active_journey?.start_at ? new Date(selected.active_journey.start_at).toLocaleTimeString() : '—'}</Text>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  map: { width, height: height * 0.65 },
  callout: { padding: spacing.xs, minWidth: 150 },
  calloutTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  calloutText: { fontSize: 11, color: '#555', marginBottom: 1 },
  infoCard: { position: 'absolute', bottom: 20, left: spacing.xl, right: spacing.xl, elevation: 6 },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.xs },
  infoText: { fontSize: 13, color: '#555', marginBottom: 2 },
});
