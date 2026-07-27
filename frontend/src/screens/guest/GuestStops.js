import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { publicService } from '../../services/publicService';
import Card from '../../components/ui/Card';
import CtaModal from '../../components/ui/CtaModal';
import { colors, typography, spacing } from '../../theme';

export default function GuestStops() {
  const [stops, setStops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    publicService.getStops().then((res) => {
      const data = res.data.data || res.data || [];
      setStops(data);
      setFiltered(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(stops); return; }
    const q = search.toLowerCase();
    setFiltered(stops.filter((s) => (s.name || '').toLowerCase().includes(q)));
  }, [search, stops]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paradas</Text>
        <TextInput style={styles.search} placeholder="Buscar parada..." value={search} onChangeText={setSearch} placeholderTextColor={colors.textSecondary} />
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
              <Text style={styles.ctaTitle}>ETA en tiempo real</Text>
              <Text style={styles.ctaDesc}>Regístrate para ver el tiempo de llegada estimado de los buses a cada parada.</Text>
              <View style={styles.ctaBtn} onTouchEnd={() => setCtaVisible(true)}>
                <Text style={styles.ctaBtnText}>Crear cuenta</Text>
              </View>
            </Card>
          )}
          renderItem={({ item }) => (
            <Card>
              <Text style={styles.stopName}>{item.name}</Text>
              {item.address && <Text style={styles.stopAddr} numberOfLines={1}>{item.address}</Text>}
            </Card>
          )}
        />
      )}
      <CtaModal visible={ctaVisible} onClose={() => setCtaVisible(false)} feature="El ETA en tiempo real" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.md, letterSpacing: -0.5 },
  search: { height: 44, backgroundColor: '#F5F5F5', borderRadius: 14, paddingHorizontal: spacing.lg, fontSize: 15, color: '#000' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  stopName: { fontSize: 15, fontWeight: '600' },
  stopAddr: { fontSize: 13, color: '#7D7D7D', marginTop: 4 },
  ctaCard: { marginTop: spacing.lg, alignItems: 'center', padding: spacing.lg },
  ctaTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: spacing.xs },
  ctaDesc: { fontSize: 13, color: '#7D7D7D', textAlign: 'center', marginBottom: spacing.md },
  ctaBtn: { backgroundColor: '#000', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  ctaBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
