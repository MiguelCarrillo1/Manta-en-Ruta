import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getDrivers().then((res) => setDrivers(res.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conductores</Text>
        <Text style={styles.subtitle}>{drivers.length} registrados</Text>
      </View>
      <FlatList
        data={drivers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.name}>{item.user?.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'on_journey' ? '#2ECC71' : item.status === 'available' ? '#3498DB' : '#E6E6E6' }]}>
                <Text style={styles.statusText}>{item.status?.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.detail}>📞 {item.phone}</Text>
            <Text style={styles.detail}>🪪 Lic: {item.license_number} {item.license_expiration ? `(exp: ${item.license_expiration})` : ''}</Text>
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
  name: { ...typography.bodyBold },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { ...typography.small, color: '#fff', fontWeight: '600', textTransform: 'capitalize' },
  detail: { ...typography.caption, marginBottom: 2 },
});
