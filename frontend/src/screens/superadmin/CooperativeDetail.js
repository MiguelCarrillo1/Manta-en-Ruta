import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Alert, TouchableOpacity } from 'react-native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function CooperativeDetail({ route }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coop, setCoop] = useState(null);
  const [name, setName] = useState('');
  const [ruc, setRuc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    superadminService.getCooperative(id).then((r) => {
      const c = r.data?.data || r.data;
      setCoop(c); setName(c.name); setRuc(c.ruc || ''); setPhone(c.phone || ''); setEmail(c.email || ''); setAddress(c.address || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try { await superadminService.updateCooperative(id, { name, ruc, phone, email, address }); Alert.alert('Éxito', 'Cooperativa actualizada'); }
    catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleAssignGerente = () => {
    Alert.prompt('Asignar Gerente', 'ID del usuario:', async (userId) => {
      if (!userId) return;
      try { await superadminService.assignGerente(id, parseInt(userId)); Alert.alert('Éxito', 'Gerente asignado'); const r = await superadminService.getCooperative(id); const c = r.data?.data || r.data; setCoop(c); }
      catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
    });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!coop) return <View style={styles.center}><Text style={{ color: '#888' }}>No encontrada</Text></View>;

  const fields = [
    { label: 'Nombre', value: name, onChange: setName },
    { label: 'RUC', value: ruc, onChange: setRuc },
    { label: 'Teléfono', value: phone, onChange: setPhone },
    { label: 'Email', value: email, onChange: setEmail, keyboardType: 'email-address' },
    { label: 'Dirección', value: address, onChange: setAddress },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{coop.name}</Text>
        <View style={[styles.badge, { backgroundColor: coop.is_active ? '#E8F8EE' : '#FDE8E8' }]}>
          <Text style={[styles.badgeText, { color: coop.is_active ? '#1B8A3D' : '#C0392B' }]}>{coop.is_active ? 'Activa' : 'Inactiva'}</Text>
        </View>
      </View>

      {fields.map((f) => (
        <View key={f.label} style={styles.field}>
          <Text style={styles.label}>{f.label}</Text>
          <TextInput style={styles.input} value={f.value} onChangeText={f.onChange} keyboardType={f.keyboardType} placeholderTextColor="#999" />
        </View>
      ))}
      <Button title="Guardar Cambios" onPress={handleSave} loading={saving} style={{ marginBottom: spacing.xl }} />

      <Text style={styles.sectionTitle}>Gerente</Text>
      <View style={styles.gerenteCard}>
        <Text style={styles.gerenteValue}>{coop.gerente ? `${coop.gerente.name} (${coop.gerente.email})` : 'Sin asignar'}</Text>
        <TouchableOpacity style={styles.gerenteBtn} onPress={handleAssignGerente}>
          <Text style={styles.gerenteBtnText}>{coop.gerente ? 'Cambiar' : 'Asignar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 40, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, marginLeft: spacing.sm },
  badgeText: { fontWeight: '600', fontSize: 11 },
  field: { marginBottom: spacing.md },
  label: { fontSize: 11, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  input: { height: 50, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: spacing.lg, fontSize: 15, color: '#000', borderWidth: 1, borderColor: '#E8E8E8' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  gerenteCard: { backgroundColor: '#FFF', borderRadius: 14, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  gerenteValue: { flex: 1, fontSize: 14, color: '#333' },
  gerenteBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  gerenteBtnText: { fontSize: 13, fontWeight: '600' },
});
