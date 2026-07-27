import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    superadminService.getCatalogs().then((r) => setCatalogs(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name) { Alert.alert('Error', 'Nombre requerido'); return; }
    try {
      await superadminService.createCatalog({ name, description, scope: 'global' });
      Alert.alert('Éxito', 'Catálogo creado');
      setShowForm(false); setName(''); setDescription('');
      const r = await superadminService.getCatalogs(); setCatalogs(r.data?.data || []);
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Catálogos <Text style={styles.count}>({catalogs.length})</Text></Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nombre *" value={name} onChangeText={setName} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} placeholderTextColor="#999" />
          <Button title="Guardar" onPress={handleCreate} />
        </View>
      )}

      <FlatList
        data={catalogs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin catálogos</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CatalogItems', { catalogId: item.id, catalogName: item.name })}>
            <Text style={styles.cardName}>{item.name}</Text>
            {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
            <Text style={styles.cardLink}>Ver items →</Text>
          </TouchableOpacity>
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
  cardName: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 13, color: '#888', marginTop: 4 },
  cardLink: { fontSize: 13, fontWeight: '600', marginTop: spacing.md, color: '#000' },
});
