import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function FuelHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getFuelHistory().then((r) => setRecords(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial Combustible</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin registros</Text>}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.vehicleId}>Vehículo #{item.vehicle_id}</Text>
              <Text style={styles.amount}>${item.cost || 0}</Text>
            </View>
            <Text style={styles.detail}>{item.liters || item.amount || 0} L  |  ${item.cost || 0}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
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
  vehicleId: { ...typography.bodyBold },
  amount: { ...typography.bodyBold, color: '#2ECC71' },
  detail: { ...typography.body, marginBottom: 2 },
  date: { ...typography.caption },
});
