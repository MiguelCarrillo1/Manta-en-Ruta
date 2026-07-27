import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuthStore } from '../../store';
import { colors, typography, spacing } from '../../theme';

export default function CtaModal({ visible, onClose, feature }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Función exclusiva</Text>
          <Text style={styles.desc}>
            {feature || 'Esta función'} está disponible solo para usuarios registrados.
            {'\n'}Crea una cuenta gratis y accede a:
          </Text>
          <View style={styles.bullets}>
            <Text style={styles.bullet}>• Ubicación en vivo de buses</Text>
            <Text style={styles.bullet}>• Tiempo estimado de llegada (ETA)</Text>
            <Text style={styles.bullet}>• Monitoreo de ocupación</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => { onClose(); logout(); }}>
            <Text style={styles.ctaText}>Crear cuenta gratis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Seguir como invitado</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: spacing.xl, width: '100%', maxWidth: 340, alignItems: 'center' },
  icon: { fontSize: 40, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'center' },
  desc: { ...typography.body, textAlign: 'center', marginBottom: spacing.md, lineHeight: 20 },
  bullets: { alignSelf: 'flex-start', marginBottom: spacing.lg },
  bullet: { ...typography.body, marginBottom: 4 },
  ctaBtn: { height: 50, backgroundColor: '#000', borderRadius: 14, alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: spacing.sm },
  ctaText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  cancelText: { ...typography.body, color: '#7D7D7D' },
});
