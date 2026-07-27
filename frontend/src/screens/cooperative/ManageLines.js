import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { cooperativeService } from '../../services/cooperativeService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function ManageLines() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => { cooperativeService.getLines().then((r) => setLines(r.data?.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!name) { Alert.alert('Error', 'Nombre requerido'); return; }
    try {
      await cooperativeService.createLine({ name, description, color });
      Alert.alert('Éxito', 'Línea creada');
      setShowForm(false); setName(''); setDescription(''); setColor('');
      const r = await cooperativeService.getLines(); setLines(r.data?.data || []);
    } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Error'); }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar', '¿Eliminar línea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await cooperativeService.deleteLine(id); const r = await cooperativeService.getLines(); setLines(r.data?.data || []); }
        catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Líneas</Text>
        <Button title={showForm ? 'Cancelar' : '+ Nueva'} onPress={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'} style={{ paddingHorizontal: 16, height: 40 }} />
      </View>
      {showForm && (
        <Card style={{ marginHorizontal: spacing.xl }}>
          <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} placeholderTextColor={colors.textSecondary} />
          <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} placeholderTextColor={colors.textSecondary} />
          <TextInput style={styles.input} placeholder="Color (ej. #ff0000)" value={color} onChangeText={setColor} placeholderTextColor={colors.textSecondary} />
          <Button title="Guardar" onPress={handleCreate} />
        </Card>
      )}
      <FlatList
        data={lines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <View style={[styles.colorDot, { backgroundColor: item.color || '#000' }]} />
              <Text style={styles.lineName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.delete}>Eliminar</Text></TouchableOpacity>
            </View>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30, marginTop: spacing.sm },
  input: { height: 44, backgroundColor: colors.grayLight, borderRadius: borderRadius.sm, paddingHorizontal: spacing.md, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  lineName: { ...typography.bodyBold, flex: 1 },
  delete: { ...typography.small, color: '#C0392B', fontWeight: '600' },
  desc: { ...typography.caption, marginTop: spacing.xs },
});
