import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService } from '../../services/publicService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function Lines() {
  const [lines, setLines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    publicService.getLines().then((res) => {
      const data = res.data.data || res.data || [];
      setLines(data);
      setFiltered(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(lines); return; }
    const q = search.toLowerCase();
    setFiltered(lines.filter((l) => (l.name || '').toLowerCase().includes(q) || (l.description || '').toLowerCase().includes(q)));
  }, [search, lines]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Líneas</Text>
        <TextInput style={styles.search} placeholder="Buscar línea..." value={search} onChangeText={setSearch} placeholderTextColor={colors.textSecondary} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('LineDetail', item)}>
              <Text style={styles.lineName}>{item.name}</Text>
              {item.description && <Text style={styles.lineDesc} numberOfLines={2}>{item.description}</Text>}
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.md, letterSpacing: -0.5 },
  search: { height: 44, backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: spacing.lg, fontSize: 15, color: '#000' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  lineName: { fontSize: 15, fontWeight: '600' },
  lineDesc: { fontSize: 13, color: '#7D7D7D', marginTop: spacing.xs },
});
