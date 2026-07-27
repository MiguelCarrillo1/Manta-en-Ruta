import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { publicService } from '../../services/publicService';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function LineDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const line = route.params;
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicService.getStops().then((r) => {
        const all = r.data.data || r.data || [];
        setStops(all.filter((s) => s.line_id === line.id));
      }).catch(() => {}),
      userService.getActiveBuses().then((r) => {
        const all = r.data.data || r.data || [];
        setBuses(all.filter((b) => b.line_id === line.id));
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [line.id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{line.name}</Text>
        {line.description && <Text style={styles.desc}>{line.description}</Text>}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={[
            { title: 'Paradas', count: stops.length, data: stops, nameKey: 'name', detailKey: 'StopDetail' },
            { title: 'Buses Activos', count: buses.length, data: buses, nameKey: 'plate', detailKey: 'BusDetail' },
          ]}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{item.title} ({item.count})</Text>
              {item.data.length === 0 && <Text style={styles.empty}>Sin datos</Text>}
              {item.data.map((entry, idx) => (
                <Card key={idx} onPress={() => navigation.navigate(item.detailKey, entry)}>
                  <Text style={styles.entryName}>{entry[item.nameKey]}</Text>
                </Card>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  back: { paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  backText: { ...typography.body, color: colors.textSecondary },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  desc: { ...typography.caption, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  entryName: { ...typography.bodyBold },
  empty: { ...typography.caption, fontStyle: 'italic' },
});
