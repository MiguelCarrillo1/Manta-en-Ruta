import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing, borderRadius } from '../../theme';

const SEV_COLORS = { critical: '#C0392B', high: '#E67E22', medium: '#F39C12', low: '#2ECC71' };

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getAlerts().then((r) => setAlerts(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'attend') await cooperativeService.attendAlert(id);
      else if (action === 'resolve') await cooperativeService.resolveAlert(id);
      else await cooperativeService.closeAlert(id);
      const res = await cooperativeService.getAlerts();
      setAlerts(res.data?.data || []);
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin alertas</Text>}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <View style={[styles.badge, { backgroundColor: SEV_COLORS[item.severity] || '#95A5A6' }]}>
                <Text style={styles.badgeText}>{item.severity}</Text>
              </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>Estado: {item.status} {item.vehicle?.plate ? `| Veh: ${item.vehicle.plate}` : ''}</Text>
            <View style={styles.actions}>
              {item.status === 'active' && <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(item.id, 'attend')}><Text style={styles.actionText}>Atender</Text></TouchableOpacity>}
              {item.status === 'attended' && <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2ECC71' }]} onPress={() => handleAction(item.id, 'resolve')}><Text style={styles.actionText}>Resolver</Text></TouchableOpacity>}
              {(item.status === 'resolved' || item.status === 'active') && <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#95A5A6' }]} onPress={() => handleAction(item.id, 'close')}><Text style={styles.actionText}>Cerrar</Text></TouchableOpacity>}
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
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: spacing.xl, marginBottom: spacing.md, letterSpacing: -0.5 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  empty: { ...typography.caption, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  alertTitle: { ...typography.bodyBold, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { ...typography.small, color: '#fff', fontWeight: '600', textTransform: 'uppercase' },
  desc: { ...typography.body, marginBottom: spacing.xs },
  meta: { ...typography.caption, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.sm },
  actionText: { ...typography.small, color: colors.secondary, fontWeight: '600' },
});
