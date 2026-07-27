import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function FuelRegister() {
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!amount || !cost) { Alert.alert('Error', 'Completa ambos campos'); return; }
    setLoading(true);
    try {
      const res = await api.post('/driver/fuel-notes', { amount: parseFloat(amount), cost: parseFloat(cost) });
      Alert.alert('Registrado', `Combustible: ${amount} galones`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Combustible</Text>
      <TextInput style={styles.input} placeholder="Cantidad (galones)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
      <TextInput style={styles.input} placeholder="Costo $" value={cost} onChangeText={setCost} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
      <Button title="Guardar" onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: spacing.xl, letterSpacing: -0.5 },
  input: { height: 50, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.md },
});
