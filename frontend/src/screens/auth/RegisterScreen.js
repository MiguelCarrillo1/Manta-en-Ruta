import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Todos los campos son requeridos'); return; }
    if (password.length < 8) { Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, password_confirmation: password });
      Alert.alert('Éxito', 'Cuenta creada. Ahora inicia sesión.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a Manta en Ruta</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Tu nombre" value={name} onChangeText={setName} placeholderTextColor={colors.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="tu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textSecondary} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordWrap}>
            <TextInput style={[styles.input, { flex: 1, backgroundColor: 'transparent', borderWidth: 0 }]} placeholder="Mínimo 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor={colors.textSecondary} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eye}>
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.secondary} /> : <Text style={styles.btnText}>Crear Cuenta</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.xs, letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginBottom: spacing.xxl },
  inputGroup: { marginBottom: spacing.md },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  input: { height: 50, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.grayLight, borderRadius: borderRadius.md },
  eye: { padding: spacing.md },
  btn: { height: 50, backgroundColor: colors.primary, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  btnText: { color: colors.secondary, fontSize: 15, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: spacing.xxl },
  linkText: { ...typography.caption },
});
