import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function CatalogItems({ route }) {
  const { catalogId, catalogName } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    superadminService.getCatalogItems(catalogId).then((r) => setItems(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!code || !label) { Alert.alert('Error', 'Código y etiqueta requeridos'); return; }
    try {
      await superadminService.createCatalogItem(catalogId, { code, label, value, order: items.length + 1, active: true });
      Alert.alert('Éxito', 'Item creado');
      setShowForm(false); setCode(''); setLabel(''); setValue('');
      const r = await superadminService.getCatalogItems(catalogId); setItems(r.data?.data || []);
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{catalogName} <Text style={styles.count}>({items.length})</Text></Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Código *" value={code} onChangeText={setCode} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Etiqueta *" value={label} onChangeText={setLabel} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Valor" value={value} onChangeText={setValue} placeholderTextColor="#999" />
          <Button title="Guardar" onPress={handleCreate} />
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin items</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <View style={[styles.badge, { backgroundColor: item.active ? '#E8F8EE' : '#FDE8E8' }]}>
                <Text style={[styles.badgeText, { color: item.active ? '#1B8A3D' : '#C0392B' }]}>{item.active ? 'Activo' : 'Inactivo'}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>Código: {item.code}</Text>
            {item.value && <Text style={styles.cardMeta}>Valor: {item.value}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: 12, marginBottom: spacing.sm },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  count: { fontSize: 16, fontWeight: '400', color: '#888' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 20, color: '#FFF', fontWeight: '300', lineHeight: 22 },
  form: { marginHorizontal: spacing.xl, backgroundColor: '#FFF', borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  input: { height: 44, backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: spacing.md, fontSize: 14, color: '#000', marginBottom: spacing.sm },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 14, color: '#888' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: spacing.lg, marginBottom: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  cardLabel: { fontSize: 16, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontWeight: '600', fontSize: 11 },
  cardMeta: { fontSize: 13, color: '#888', marginTop: 2 },
});
