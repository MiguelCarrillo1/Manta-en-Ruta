import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import api from '../../services/api';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth, setGuest } = useAuthStore();
  const navigation = useNavigation();

  const doLogin = async (emailVal, passwordVal) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: emailVal, password: passwordVal });
      const json = res.data;
      if (!json.success || !json.data) {
        Alert.alert('Error', json.message || 'Respuesta inválida del servidor');
        return;
      }
      const { access_token, user: userData, roles, cooperative } = json.data;
      const user = {
        id: userData.id, name: userData.name, email: userData.email, phone: userData.phone,
        role: roles?.[0] || 'usuario',
        cooperative_id: cooperative?.id || null,
        cooperative: cooperative || undefined,
      };
      await setAuth(access_token, user);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error de conexión';
      Alert.alert('Error', `No se pudo conectar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) { Alert.alert('Error', 'Ingresa email y contraseña'); return; }
    doLogin(email, password);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <View style={styles.top}>
          <Text style={styles.appName}>Manta en Ruta</Text>
          <Text style={styles.tagline}>Transporte público inteligente</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.input} placeholder="tu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textSecondary} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.passwordWrap}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor={colors.textSecondary} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eye}>
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.secondary} /> : <Text style={styles.loginText}>Iniciar Sesión</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={() => setGuest()} disabled={loading}>
            <Text style={styles.guestText}>Continuar sin cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>¿No tienes cuenta? <Text style={styles.registerBold}>Regístrate</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  top: { marginBottom: 48, alignItems: 'center' },
  appName: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1 },
  tagline: { ...typography.caption, marginTop: spacing.xs },
  form: {},
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { ...typography.caption, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 50, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.grayLight, borderRadius: borderRadius.md },
  eye: { padding: spacing.md },
  loginBtn: { height: 50, backgroundColor: colors.primary, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  loginText: { color: colors.secondary, fontSize: 15, fontWeight: '600' },
  guestBtn: { height: 50, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border },
  guestText: { ...typography.body, color: colors.textSecondary },
  registerLink: { alignItems: 'center', marginTop: spacing.xl },
  registerText: { ...typography.caption },
  registerBold: { fontWeight: '600', color: colors.textPrimary },
});
