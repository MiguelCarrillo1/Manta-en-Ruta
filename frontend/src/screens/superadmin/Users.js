import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    superadminService.getUsers().then((r) => setUsers(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Todos los campos requeridos'); return; }
    try {
      await superadminService.createUser({ name, email, password, password_confirmation: password, is_active: true });
      Alert.alert('Éxito', 'Usuario creado');
      setShowForm(false); setName(''); setEmail(''); setPassword('');
      const r = await superadminService.getUsers(); setUsers(r.data?.data || []);
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Usuarios <Text style={styles.count}>({users.length})</Text></Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nombre *" value={name} onChangeText={setName} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Contraseña *" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
          <Button title="Guardar" onPress={handleCreate} />
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Sin usuarios</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase() || '?'}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardEmail}>{item.email}</Text>
                {item.role && <View style={styles.roleBadge}><Text style={styles.roleText}>{item.role}</Text></View>}
              </View>
            </View>
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
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600' },
  cardEmail: { fontSize: 13, color: '#888', marginTop: 1 },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1, marginTop: 4 },
  roleText: { fontSize: 10, fontWeight: '600', color: '#666', textTransform: 'capitalize' },
});
