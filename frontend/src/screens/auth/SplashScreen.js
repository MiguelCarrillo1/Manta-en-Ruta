import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import { colors } from '../../theme';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { token } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.icon}>🚌</Text>
      </View>
      <Text style={styles.title}>Manta en Ruta</Text>
      <Text style={styles.tagline}>Transporte público inteligente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  icon: { fontSize: 36 },
  title: { fontSize: 28, fontWeight: '700', color: colors.secondary, letterSpacing: -0.5, marginBottom: 4 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});
