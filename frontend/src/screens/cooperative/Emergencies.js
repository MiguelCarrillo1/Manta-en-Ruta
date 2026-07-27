import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function Emergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cooperativeService.getEmergencies().then((r) => setEmergencies(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.centeredWrap}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergencias</Text>
      <FlatList
        data={emergencies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin emergencias</Text>}
        renderItem={({ item }) => (
          <Card>
            <View style={[styles.border, { backgroundColor: item.status === 'active' ? '#C0392B' : '#2ECC71' }]} />
            <Text style={styles.emergencyTitle}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>Estado: {item.status} | {new Date(item.created_at).toLocaleDateString()}</Text>
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
  border: { height: 4, borderRadius: 2, marginBottom: spacing.sm },
  emergencyTitle: { ...typography.bodyBold, marginBottom: spacing.xs },
  desc: { ...typography.body, marginBottom: spacing.xs },
  meta: { ...typography.caption },
});
