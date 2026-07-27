import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function EmergencyReport() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!description.trim()) { Alert.alert('Error', 'Describe la emergencia'); return; }
    setLoading(true);
    try {
      await api.post('/driver/emergencies', { description });
      Alert.alert('Reportado', 'Emergencia registrada', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo reportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportar Emergencia</Text>
      <TextInput style={styles.textArea} placeholder="Describe la emergencia..." value={description} onChangeText={setDescription} multiline placeholderTextColor={colors.textSecondary} />
      <Button title="Reportar" onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: spacing.xl, letterSpacing: -0.5 },
  textArea: { height: 160, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, padding: spacing.lg, fontSize: 15, color: colors.textPrimary, textAlignVertical: 'top', marginBottom: spacing.lg },
});
