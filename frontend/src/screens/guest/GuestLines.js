import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { publicService } from '../../services/publicService';
import Card from '../../components/ui/Card';
import CtaModal from '../../components/ui/CtaModal';
import { colors, typography, spacing } from '../../theme';

export default function GuestLines() {
  const [lines, setLines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);
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
    setFiltered(lines.filter((l) => (l.name || '').toLowerCase().includes(q)));
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
          ListFooterComponent={() => (
            <Card style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>¿Quieres ver buses en tiempo real?</Text>
              <Text style={styles.ctaDesc}>Regístrate gratis y accede a ubicación en vivo, ETA y más.</Text>
              <View style={styles.ctaBtn} onTouchEnd={() => setCtaVisible(true)}>
                <Text style={styles.ctaBtnText}>Crear cuenta</Text>
              </View>
            </Card>
          )}
          renderItem={({ item }) => (
            <Card>
              <Text style={styles.lineName}>{item.name}</Text>
              {item.description && <Text style={styles.lineDesc} numberOfLines={2}>{item.description}</Text>}
            </Card>
          )}
        />
      )}
      <CtaModal visible={ctaVisible} onClose={() => setCtaVisible(false)} feature="Ver buses en tiempo real" />
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
  lineDesc: { fontSize: 13, color: '#7D7D7D', marginTop: 4 },
  ctaCard: { marginTop: spacing.lg, alignItems: 'center', padding: spacing.lg },
  ctaTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: spacing.xs },
  ctaDesc: { fontSize: 13, color: '#7D7D7D', textAlign: 'center', marginBottom: spacing.md },
  ctaBtn: { backgroundColor: '#000', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  ctaBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
