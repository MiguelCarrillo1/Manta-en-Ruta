import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../theme';

const ROLE_LABELS = {
  usuario: 'Usuario',
  conductor: 'Conductor',
  operador: 'Operador',
  superadmin: 'Superadmin',
  gerente: 'Gerente',
  admin: 'Admin',
};

export default function Profile() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '—'}</Text>
        </View>
        {user?.phone && (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
          </>
        )}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Rol</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{ROLE_LABELS[user?.role] || user?.role || '—'}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.bottom}>
        <Button title="Cerrar Sesión" onPress={handleLogout} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', paddingHorizontal: spacing.xl, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: spacing.xxl, paddingTop: spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.secondary },
  name: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'right', flex: 1, marginLeft: spacing.md },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  roleBadge: { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  roleText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.xs },
  bottom: { marginTop: 'auto', marginBottom: spacing.xxl },
});
