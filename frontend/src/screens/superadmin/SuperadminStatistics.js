import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { superadminService } from '../../services/superadminService';
import { colors, typography, spacing } from '../../theme';

const STATS = [
  { key: 'total_cooperatives', label: 'Cooperativas', color: '#000' },
  { key: 'active_cooperatives', label: 'Activas', color: '#2ECC71' },
  { key: 'total_users', label: 'Usuarios', color: '#3498DB' },
  { key: 'total_vehicles', label: 'Vehículos', color: '#E67E22' },
  { key: 'total_journeys', label: 'Viajes Totales', color: '#9B59B6' },
  { key: 'active_journeys', label: 'Viajes Activos', color: '#C0392B' },
];

export default function SuperadminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const r = await superadminService.getGlobalStatistics();
      const d = r.data?.data || r.data;
      setStats(d?.total_cooperatives !== undefined ? d : null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel Global</Text>
        <Text style={styles.subtitle}>Resumen completo del sistema</Text>
      </View>

      <View style={styles.grid}>
        {STATS.map((s) => (
          <View key={s.key} style={styles.statCard}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={[styles.statValue, { color: s.color }]}>{stats?.[s.key] ?? 0}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  header: { paddingHorizontal: spacing.xl, paddingTop: 16, paddingBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#888', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm },
  statCard: { width: '31%', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: spacing.lg, paddingHorizontal: spacing.sm, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: spacing.sm },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
});
