import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Cooperatives() {
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [ruc, setRuc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const load = async (q) => {
    try {
      const res = await superadminService.getCooperatives(q ? { q } : {});
      const d = res.data?.data || res.data || [];
      setCooperatives(Array.isArray(d) ? d : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setLoading(true); load(search); };

  const handleCreate = async () => {
    if (!name) { Alert.alert('Error', 'Nombre requerido'); return; }
    try {
      await superadminService.createCooperative({ name, ruc, phone, email, address, scope: 'urbano' });
      Alert.alert('Éxito', 'Cooperativa creada');
      setShowForm(false); setName(''); setRuc(''); setPhone(''); setEmail(''); setAddress('');
      load();
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  const handleToggle = (item) => {
    Alert.alert('Confirmar', `${item.is_active ? 'Desactivar' : 'Activar'} ${item.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: async () => {
        try { await superadminService.updateCooperative(item.id, { is_active: !item.is_active }); load(); }
        catch (e) { Alert.alert('Error', 'No se pudo actualizar'); }
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Buscar cooperativa..." value={search} onChangeText={setSearch} onSubmitEditing={handleSearch} placeholderTextColor="#999" returnKeyType="search" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Cooperativas <Text style={styles.count}>({cooperatives.length})</Text></Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nombre *" value={name} onChangeText={setName} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="RUC" value={ruc} onChangeText={setRuc} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Dirección" value={address} onChangeText={setAddress} placeholderTextColor="#999" />
          <Button title="Guardar" onPress={handleCreate} />
        </View>
      )}

      <FlatList
        data={cooperatives}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin cooperativas</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CooperativeDetail', { id: item.id })}>
            <View style={styles.cardTop}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={[styles.badge, { backgroundColor: item.is_active ? '#E8F8EE' : '#FDE8E8' }]}>
                <Text style={[styles.badgeText, { color: item.is_active ? '#1B8A3D' : '#C0392B' }]}>{item.is_active ? 'Activa' : 'Inactiva'}</Text>
              </View>
            </View>
            {item.ruc ? <Text style={styles.cardDetail}>RUC: {item.ruc}</Text> : null}
            {item.address ? <Text style={styles.cardDetail}>{item.address}</Text> : null}
            <View style={styles.cardActions}>
              <Text style={styles.actionEdit}>Editar</Text>
              <Text style={[styles.actionToggle, { color: item.is_active ? '#C0392B' : '#1B8A3D' }]} onPress={() => handleToggle(item)}>
                {item.is_active ? 'Desactivar' : 'Activar'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  search: { marginHorizontal: spacing.xl, marginTop: 12, height: 44, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: spacing.lg, fontSize: 14, color: '#000', borderWidth: 1, borderColor: '#E8E8E8' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.md, marginBottom: spacing.sm },
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
  cardName: { fontSize: 16, fontWeight: '600', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontWeight: '600', fontSize: 11 },
  cardDetail: { fontSize: 13, color: '#888', marginTop: 3 },
  cardActions: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  actionEdit: { fontSize: 13, fontWeight: '600', color: '#000' },
  actionToggle: { fontSize: 13, fontWeight: '600' },
});
