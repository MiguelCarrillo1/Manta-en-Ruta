import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function CoopStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getStatistics().then((r) => {
      const d = r.data?.data || r.data;
      setStats(d?.total_vehicles !== undefined ? d : null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!stats) return <View style={styles.centeredWrap}><Text style={styles.empty}>Sin datos</Text></View>;

  const items = [
    { label: 'Vehículos Totales', value: stats.total_vehicles, color: colors.textPrimary },
    { label: 'Vehículos Activos', value: stats.active_vehicles, color: '#2ECC71' },
    { label: 'Conductores', value: stats.total_drivers, color: colors.textPrimary },
    { label: 'Conductores en Ruta', value: stats.active_drivers, color: '#2ECC71' },
    { label: 'Viajes Totales', value: stats.total_journeys, color: colors.textPrimary },
    { label: 'Viajes Activos', value: stats.active_journeys, color: '#3498DB' },
    { label: 'Kilómetros Totales', value: `${stats.total_km} km`, color: colors.textPrimary },
    { label: 'Costo Combustible', value: `$${stats.total_fuel_cost}`, color: '#E67E22' },
    { label: 'Costo Mantenimiento', value: `$${stats.total_maintenance_cost}`, color: '#E67E22' },
    { label: 'Alertas Pendientes', value: stats.alerts_pending, color: stats.alerts_pending > 0 ? '#C0392B' : '#2ECC71' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Estadísticas</Text>
      <View style={styles.grid}>
        {items.map((item, idx) => (
          <Card key={idx} style={styles.statCard}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, { color: item.color }]}>{item.value ?? 0}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  centeredWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  empty: { ...typography.caption },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: spacing.xl, marginBottom: spacing.md, letterSpacing: -0.5 },
  grid: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  statCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.body, color: colors.textSecondary },
  value: { fontSize: 20, fontWeight: '700' },
});
