import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Switch } from 'react-native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [allPerms, setAllPerms] = useState([]);
  const [rolePermIds, setRolePermIds] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  useEffect(() => {
    superadminService.getRoles().then((r) => setRoles(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadPermissions = async (roleId) => {
    setLoadingPerms(true);
    setSelectedRole(roleId);
    try {
      const [permsRes, roleRes] = await Promise.all([
        superadminService.getPermissions(),
        superadminService.getRole(roleId),
      ]);
      const grouped = permsRes.data?.data || {};
      const flat = Object.values(grouped).flat();
      const rolePerms = roleRes.data?.data?.permissions || [];
      setAllPerms(flat);
      setRolePermIds(rolePerms.map((p) => p.id));
    } catch (e) { console.error(e); }
    finally { setLoadingPerms(false); }
  };

  const togglePermission = (permId) => {
    setRolePermIds((prev) => prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]);
  };

  const handleSave = async () => {
    try { await superadminService.assignPermissions(selectedRole, rolePermIds); Alert.alert('Éxito', 'Permisos actualizados'); }
    catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roles y Permisos</Text>
      <Text style={styles.subtitle}>Selecciona un rol para editar sus permisos</Text>

      <FlatList horizontal data={roles} keyExtractor={(item) => String(item.id)} style={styles.chipList} showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.chip, selectedRole === item.id && styles.chipActive]} onPress={() => loadPermissions(item.id)}>
            <Text style={[styles.chipText, selectedRole === item.id && styles.chipTextActive]}>{item.display_name || item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {loadingPerms ? (
        <ActivityIndicator style={{ marginTop: 60 }} color="#000" />
      ) : selectedRole ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={allPerms}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.permList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.permCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.permName}>{item.name}</Text>
                  {item.description && <Text style={styles.permDesc}>{item.description}</Text>}
                </View>
                <Switch value={rolePermIds.includes(item.id)} onValueChange={() => togglePermission(item.id)} trackColor={{ false: '#E8E8E8', true: '#CCC' }} thumbColor={rolePermIds.includes(item.id) ? '#000' : '#f4f3f4'} />
              </View>
            )}
          />
          <Button title="Guardar Permisos" onPress={handleSave} style={{ margin: spacing.xl }} />
        </View>
      ) : (
        <Text style={styles.hint}>Selecciona un rol para ver sus permisos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  title: { fontSize: 24, fontWeight: '700', paddingHorizontal: spacing.xl, marginTop: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#888', paddingHorizontal: spacing.xl, marginTop: 4, marginBottom: spacing.md },
  chipList: { paddingHorizontal: spacing.xl, maxHeight: 44, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: '#FFF', marginRight: spacing.sm, borderWidth: 1, borderColor: '#E8E8E8' },
  chipActive: { backgroundColor: '#000', borderColor: '#000' },
  chipText: { fontSize: 14, color: '#666' },
  chipTextActive: { color: '#FFF', fontWeight: '600' },
  permList: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  permCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: spacing.lg, marginBottom: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3 },
  permName: { fontSize: 15, fontWeight: '600' },
  permDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  hint: { textAlign: 'center', marginTop: 80, fontSize: 14, color: '#888' },
});
