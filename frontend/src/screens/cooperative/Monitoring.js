import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

const STATUS_COLORS = { active: '#2ECC71', paused: '#F39C12', finished: '#7D7D7D', offline: '#C0392B' };

export default function Monitoring() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await cooperativeService.getVehiclesPositions();
        const data = res.data?.data || res.data || [];
        setVehicles(Array.isArray(data) ? data : []);
      } catch (e) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoreo en Vivo</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <>
          <MapView style={styles.map} initialRegion={{ latitude: -0.948, longitude: -80.716, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
            {vehicles.filter((v) => v.latitude && v.longitude).map((v) => (
              <Marker key={v.id} coordinate={{ latitude: parseFloat(v.latitude), longitude: parseFloat(v.longitude) }} pinColor={STATUS_COLORS[v.status] || STATUS_COLORS.offline}>
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{v.plate || v.name}</Text>
                    {v.driver && <Text style={styles.calloutText}>Conductor: {v.driver.name}</Text>}
                    {v.speed && <Text style={styles.calloutText}>Velocidad: {v.speed} km/h</Text>}
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          <Card style={styles.legend}>
            <Text style={styles.legendTitle}>Leyenda</Text>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: STATUS_COLORS.active }]} /><Text>Activo</Text></View>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: STATUS_COLORS.paused }]} /><Text>En Pausa</Text></View>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: STATUS_COLORS.offline }]} /><Text>Desconectado</Text></View>
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '700', paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.md },
  map: { width: Dimensions.get('window').width, height: 350 },
  callout: { minWidth: 120 },
  calloutTitle: { fontWeight: '600', fontSize: 14, marginBottom: 4 },
  calloutText: { fontSize: 12, color: '#555' },
  legend: { margin: spacing.xl, marginTop: spacing.md },
  legendTitle: { ...typography.bodyBold, marginBottom: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
