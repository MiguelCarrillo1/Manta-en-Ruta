import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function CoopDashboard() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeJourneys, setActiveJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      cooperativeService.getStatistics().then((r) => {
        const d = r.data?.data || r.data;
        setStats(d?.total_vehicles !== undefined ? d : null);
      }).catch(() => {}),
      cooperativeService.getAlerts().then((r) => {
        const d = r.data?.data || r.data || [];
        setAlerts((Array.isArray(d) ? d : []).slice(0, 5));
      }).catch(() => {}),
      cooperativeService.getActiveJourneys().then((r) => {
        const d = r.data?.data || r.data || [];
        setActiveJourneys(Array.isArray(d) ? d : []);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logout(); };

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>{user?.cooperative?.name || 'Cooperativa'}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.statCard}><Text style={styles.statNumber}>{stats?.total_vehicles || 0}</Text><Text style={styles.statLabel}>Vehículos</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNumber, { color: '#2ECC71' }]}>{stats?.active_vehicles || 0}</Text><Text style={styles.statLabel}>Activos</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>{stats?.total_drivers || 0}</Text><Text style={styles.statLabel}>Conductores</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNumber, { color: '#2ECC71' }]}>{stats?.active_drivers || 0}</Text><Text style={styles.statLabel}>En Ruta</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNumber, { color: '#3498DB' }]}>{activeJourneys.length || stats?.active_journeys || 0}</Text><Text style={styles.statLabel}>Viajes Activos</Text></View>
        <View style={styles.statCard}><Text style={styles.statNumber}>{stats?.total_km || 0}</Text><Text style={styles.statLabel}>Km Totales</Text></View>
      </View>

      {alerts.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          {alerts.map((a) => (
            <View key={a.id} style={styles.alertRow}>
              <View style={[styles.severityDot, { backgroundColor: a.severity === 'critical' ? '#C0392B' : a.severity === 'high' ? '#E67E22' : '#F39C12' }]} />
              <View style={{ flex: 1 }}><Text style={styles.alertTitle}>{a.title}</Text><Text style={styles.alertStatus}>{a.status}</Text></View>
            </View>
          ))}
          <Text style={styles.seeAll} onPress={() => navigation.navigate('Alerts')}>Ver todas las alertas</Text>
        </Card>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionGrid}>
          {[
            { label: 'Vehículos', screen: 'Vehicles', icon: '🚌' },
            { label: 'Conductores', screen: 'Drivers', icon: '👤' },
            { label: 'Monitoreo', screen: 'Monitoring', icon: '🛰️' },
            { label: 'Líneas', screen: 'ManageLines', icon: '📋' },
            { label: 'Alertas', screen: 'Alerts', icon: '🔔' },
            { label: 'Estadísticas', screen: 'CoopStatistics', icon: '📊' },
          ].map((item) => (
            <TouchableOpacity key={item.screen} style={styles.actionBtn} onPress={() => navigation.navigate(item.screen)}>
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button title="Cerrar Sesión" onPress={handleLogout} variant="secondary" style={{ marginVertical: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  centeredWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { marginBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginTop: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: { width: '31%', backgroundColor: colors.grayLight, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
  sectionTitle: { ...typography.bodyBold, marginBottom: spacing.sm },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  alertTitle: { ...typography.body, flex: 1 },
  alertStatus: { ...typography.small, color: colors.textSecondary, textTransform: 'capitalize' },
  seeAll: { ...typography.caption, fontWeight: '600', textAlign: 'right', marginTop: spacing.xs },
  quickActions: { marginBottom: spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionBtn: { width: '31%', backgroundColor: colors.grayLight, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  actionIcon: { fontSize: 24, marginBottom: spacing.xs },
  actionLabel: { ...typography.small, textAlign: 'center' },
});
