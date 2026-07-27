import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { superadminService } from '../../services/superadminService';
import { colors, typography, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const STATS = [
  { key: 'total_cooperatives', label: 'Cooperativas', color: '#000', icon: '◆' },
  { key: 'active_cooperatives', label: 'Activas', color: '#2ECC71', icon: '●' },
  { key: 'total_users', label: 'Usuarios', color: '#3498DB', icon: '●' },
  { key: 'total_vehicles', label: 'Vehículos', color: '#E67E22', icon: '●' },
  { key: 'total_journeys', label: 'Viajes', color: '#9B59B6', icon: '●' },
  { key: 'active_journeys', label: 'Viajes Activos', color: '#C0392B', icon: '●' },
];

const QUICK_LINKS = [
  { label: 'Cooperativas', screen: 'Cooperatives', desc: 'Gestionar cooperativas' },
  { label: 'Catálogos', screen: 'Catalogs', desc: 'Catálogos del sistema' },
  { label: 'Roles', screen: 'Roles', desc: 'Roles y permisos' },
  { label: 'Config.', screen: 'GlobalConfig', desc: 'Configuración global' },
  { label: 'Usuarios', screen: 'Users', desc: 'Usuarios del sistema' },
  { label: 'Estadísticas', screen: 'SuperadminStatistics', desc: 'Panel de estadísticas' },
  { label: 'Registros', screen: 'Logs', desc: 'Logs y auditoría' },
];

export default function SuperadminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const load = async () => {
    try {
      const r = await superadminService.getGlobalStatistics();
      setStats(r.data?.data || r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Panel de Control</Text>
        <Text style={styles.subtitle}>Resumen general del sistema</Text>
      </View>

      <View style={styles.grid}>
        {STATS.map((s) => (
          <View key={s.key} style={styles.statCard}>
            <Text style={[styles.statIcon, { color: s.color }]}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{stats?.[s.key] ?? 0}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Acceso Rápido</Text>
      {QUICK_LINKS.map((link) => (
        <TouchableOpacity key={link.screen} style={styles.linkCard} onPress={() => navigation.navigate(link.screen)}>
          <View style={styles.linkContent}>
            <Text style={styles.linkLabel}>{link.label}</Text>
            <Text style={styles.linkDesc}>{link.desc}</Text>
          </View>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  header: { paddingHorizontal: spacing.xl, paddingTop: 16, paddingBottom: spacing.lg, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  greeting: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm },
  statCard: { width: '31%', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: spacing.lg, paddingHorizontal: spacing.sm, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  statIcon: { fontSize: 18, marginBottom: spacing.xs },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: spacing.xl, marginTop: spacing.md, marginBottom: spacing.sm },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: spacing.xl, marginBottom: spacing.sm, borderRadius: 14, padding: spacing.lg, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  linkContent: { flex: 1 },
  linkLabel: { fontSize: 15, fontWeight: '600' },
  linkDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  linkArrow: { fontSize: 16, color: '#CCC', marginLeft: spacing.sm },
});
