import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function IncidentScreen() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!description.trim()) { Alert.alert('Error', 'Describe el incidente'); return; }
    setLoading(true);
    try {
      await api.post('/incidents', { description });
      Alert.alert('Reportado', 'Incidente registrado', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo reportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportar Incidente</Text>
      <Text style={styles.subtitle}>Describe lo ocurrido</Text>
      <TextInput style={styles.textArea} placeholder="Describe el incidente..." value={description} onChangeText={setDescription} multiline placeholderTextColor={colors.textSecondary} />
      <Button title="Reportar" onPress={handleSubmit} loading={loading} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: spacing.xs, letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginBottom: spacing.xl },
  textArea: { height: 160, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, padding: spacing.lg, fontSize: 15, color: colors.textPrimary, textAlignVertical: 'top', marginBottom: spacing.lg },
});
