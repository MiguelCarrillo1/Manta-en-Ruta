import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getVehicles().then((res) => setVehicles(res.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehículos</Text>
        <Text style={styles.subtitle}>{vehicles.length} registrados</Text>
      </View>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.plate}>{item.plate}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#2ECC71' : item.status === 'maintenance' ? '#F39C12' : '#E6E6E6' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.detail}>{item.brand} {item.model} ({item.year})</Text>
            <Text style={styles.detail}>Capacidad: {item.capacity} pers.</Text>
            <View style={styles.features}>
              {item.has_ac && <Text style={styles.feature}>❄️ AC</Text>}
              {item.has_wifi && <Text style={styles.feature}>📶 WiFi</Text>}
              <Text style={styles.feature}>{item.vehicle_type}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  centeredWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  plate: { ...typography.h3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { ...typography.small, color: '#fff', fontWeight: '600', textTransform: 'capitalize' },
  detail: { ...typography.caption, marginBottom: 2 },
  features: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  feature: { ...typography.small },
});
