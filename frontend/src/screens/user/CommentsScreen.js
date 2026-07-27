import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function CommentsScreen() {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!comment.trim()) { Alert.alert('Error', 'Escribe un comentario'); return; }
    setLoading(true);
    try {
      await api.post('/comments', { content: comment });
      Alert.alert('Enviado', 'Gracias por tu comentario', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      <Text style={styles.subtitle}>Comparte tu experiencia</Text>
      <TextInput style={styles.textArea} placeholder="Escribe tu comentario aquí..." value={comment} onChangeText={setComment} multiline placeholderTextColor={colors.textSecondary} />
      <Button title="Enviar Comentario" onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: spacing.xs, letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginBottom: spacing.xl },
  textArea: { height: 140, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, padding: spacing.lg, fontSize: 15, color: colors.textPrimary, textAlignVertical: 'top', marginBottom: spacing.lg },
});
