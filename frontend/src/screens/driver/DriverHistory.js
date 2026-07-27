import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function DriverHistory() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/driver/journeys').then((res) => {
      setJourneys(res.data.data || res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={journeys}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>Sin viajes registrados</Text>}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Text style={styles.lineName}>{item.line?.name || 'Línea'}</Text>
                <Text style={[styles.status, item.status === 'completed' && styles.completed]}>{item.status}</Text>
              </View>
              <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              {item.final_km && <Text style={styles.km}>{item.final_km} km</Text>}
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: spacing.xl, marginBottom: spacing.md, letterSpacing: -0.5 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  empty: { ...typography.caption, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineName: { ...typography.bodyBold },
  status: { ...typography.small, color: colors.textSecondary, textTransform: 'capitalize' },
  completed: { color: colors.success },
  date: { ...typography.caption, marginTop: spacing.xs },
  km: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
});
