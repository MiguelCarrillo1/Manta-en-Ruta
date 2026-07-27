import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Maintenance() {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('preventive');

  useEffect(() => { cooperativeService.getMaintenances().then((r) => setMaintenances(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!vehicleId || !description) { Alert.alert('Error', 'Vehículo y descripción requeridos'); return; }
    try {
      await cooperativeService.createMaintenance({ vehicle_id: parseInt(vehicleId), description, type, scheduled_date: new Date().toISOString().split('T')[0], status: 'scheduled', mechanic: '', notes: '' });
      Alert.alert('Éxito', 'Mantenimiento creado');
      setShowForm(false); setVehicleId(''); setDescription('');
      const r = await cooperativeService.getMaintenances(); setMaintenances(r.data?.data || []);
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mantenimiento</Text>
        <Button title={showForm ? 'Cancelar' : '+ Nuevo'} onPress={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'} style={{ paddingHorizontal: 16, height: 40 }} />
      </View>
      {showForm && (
        <Card style={{ marginHorizontal: spacing.xl }}>
          <TextInput style={styles.input} placeholder="ID del Vehículo" value={vehicleId} onChangeText={setVehicleId} keyboardType="numeric" placeholderTextColor={colors.textSecondary} />
          <TextInput style={styles.input} placeholder="Tipo (preventive/corrective/predictive)" value={type} onChangeText={setType} placeholderTextColor={colors.textSecondary} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Descripción" value={description} onChangeText={setDescription} multiline placeholderTextColor={colors.textSecondary} />
          <Button title="Guardar" onPress={handleCreate} />
        </Card>
      )}
      <FlatList
        data={maintenances}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <Text style={styles.vehicleName}>{item.vehicle?.plate || `Vehículo #${item.vehicle_id}`}</Text>
              <View style={[styles.badge, { backgroundColor: item.status === 'completed' ? '#2ECC71' : item.status === 'in_progress' ? '#3498DB' : '#F39C12' }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.detail}>Tipo: {item.type}</Text>
            <Text style={styles.detail}>Programado: {item.scheduled_date}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30, marginTop: spacing.sm },
  input: { height: 44, backgroundColor: colors.grayLight, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  vehicleName: { ...typography.bodyBold },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { ...typography.small, color: '#fff', fontWeight: '600', textTransform: 'capitalize' },
  detail: { ...typography.caption, marginBottom: 2 },
  desc: { ...typography.body, marginTop: spacing.xs },
});
