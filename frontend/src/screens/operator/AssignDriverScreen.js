import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function AssignDriverScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerVehicle, setPickerVehicle] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/cooperative/vehicles').then((r) => setVehicles(r.data.data || r.data || [])).catch(() => {}),
      api.get('/cooperative/drivers').then((r) => setDrivers(r.data.data || r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const assignDriver = async (vehicleId, driverId) => {
    try {
      await api.post(`/cooperative/vehicles/${vehicleId}/assign-driver`, { driver_id: driverId || null });
      const res = await api.get('/cooperative/vehicles');
      setVehicles(res.data.data || res.data || []);
    } catch { Alert.alert('Error', 'No se pudo asignar'); }
    setPickerVisible(false);
  };

  const handleVehiclePress = (vehicle) => {
    const current = vehicle.drivers?.[0];
    if (current) {
      Alert.alert(
        'Desasignar',
        `¿Quitar conductor de ${vehicle.plate}? (${current.full_name || 'Asignado'})`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cambiar', onPress: () => { setPickerVehicle(vehicle); setPickerVisible(true); } },
          { text: 'Desasignar', style: 'destructive', onPress: () => assignDriver(vehicle.id, null) },
        ]
      );
    } else {
      setPickerVehicle(vehicle);
      setPickerVisible(true);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Conductores</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const currentDriver = item.drivers?.[0];
          return (
            <TouchableOpacity onPress={() => handleVehiclePress(item)}>
              <Card>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.plate}>{item.plate}</Text>
                    <Text style={styles.model}>{item.brand} {item.model} ({item.year})</Text>
                    <Text style={styles.lineLabel}>Línea: {item.line?.name || '—'}</Text>
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{currentDriver?.full_name || 'Sin conductor'}</Text>
                    <Text style={styles.tapText}>Tocar para asignar</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Asignar a {pickerVehicle?.plate}</Text>
            <FlatList
              data={drivers}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.driverRow} onPress={() => assignDriver(pickerVehicle?.id, item.id)}>
                  <Text style={styles.driverName}>{item.full_name}</Text>
                  <Text style={styles.driverDetail}>{item.license_number || ''}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPickerVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  title: { fontSize: 26, fontWeight: '700', paddingHorizontal: spacing.xl, marginBottom: spacing.md, letterSpacing: -0.5 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  row: { flexDirection: 'row', alignItems: 'center' },
  plate: { fontSize: 16, fontWeight: '700' },
  model: { fontSize: 13, color: '#7D7D7D', marginTop: 2 },
  lineLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  driverInfo: { alignItems: 'flex-end' },
  driverName: { fontSize: 14, fontWeight: '600' },
  tapText: { fontSize: 11, color: '#999', marginTop: 2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  pickerCard: { backgroundColor: '#FFF', borderRadius: 20, padding: spacing.xl, width: '100%', maxHeight: '70%', maxWidth: 340 },
  pickerTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.lg, textAlign: 'center' },
  driverRow: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  driverDetail: { fontSize: 12, color: '#999', marginTop: 2 },
  cancelBtn: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm },
  cancelText: { ...typography.body, color: '#C0392B' },
});
