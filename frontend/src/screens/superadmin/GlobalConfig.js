import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { superadminService } from '../../services/superadminService';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function GlobalConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    superadminService.getGlobalConfig().then((r) => {
      const data = r.data?.data || r.data;
      if (data?.settings) {
        const v = {};
        Object.entries(data.settings).forEach(([key, val]) => { v[key] = String(val); });
        setValues(v);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await superadminService.updateGlobalConfig({ settings: values });
      Alert.alert('Éxito', 'Configuración guardada');
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuración Global</Text>
      {Object.entries(values).map(([key, val]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
          <TextInput style={styles.input} value={val} onChangeText={(t) => setValues({ ...values, [key]: t })} placeholderTextColor="#999" />
        </View>
      ))}
      <Button title="Guardar Cambios" onPress={handleSave} loading={saving} style={{ marginTop: spacing.md }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' },
  content: { paddingHorizontal: spacing.xl, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: spacing.xl, letterSpacing: -0.5 },
  field: { marginBottom: spacing.md },
  label: { fontSize: 11, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
  input: { height: 50, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: spacing.lg, fontSize: 15, color: '#000', borderWidth: 1, borderColor: '#E8E8E8' },
});
