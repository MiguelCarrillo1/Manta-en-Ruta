import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function FinishJourney() {
  const route = useRoute();
  const navigation = useNavigation();
  const journey = route.params?.journey;
  const [finalKm, setFinalKm] = useState('');
  const [tickets, setTickets] = useState('');
  const [collected, setCollected] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!finalKm || !tickets || !collected) { Alert.alert('Error', 'Completa todos los campos'); return; }
    setLoading(true);
    try {
      await api.put(`/driver/journeys/${journey.id}/finish`, {
        final_km: parseFloat(finalKm),
        tickets_sold: parseInt(tickets, 10),
        collected: parseFloat(collected),
      });
      Alert.alert('Viaje Finalizado', 'Datos registrados correctamente', [
        { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'DriverTabs' }] }) },
      ]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo finalizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Viaje</Text>
      <Text style={styles.subtitle}>Registra los datos finales</Text>

      <Text style={styles.label}>Kilometraje Final</Text>
      <TextInput style={styles.input} placeholder="Ej: 1250.5" value={finalKm} onChangeText={setFinalKm} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

      <Text style={styles.label}>Boletos Vendidos</Text>
      <TextInput style={styles.input} placeholder="Ej: 45" value={tickets} onChangeText={setTickets} keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />

      <Text style={styles.label}>Total Recaudado ($)</Text>
      <TextInput style={styles.input} placeholder="Ej: 112.50" value={collected} onChangeText={setCollected} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

      <Button title="Finalizar Viaje" onPress={handleFinish} loading={loading} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginBottom: spacing.xl },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { height: 50, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary },
});
