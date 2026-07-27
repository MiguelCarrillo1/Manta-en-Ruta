import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing } from '../../theme';

export default function StartJourney() {
  const [lines, setLines] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    Promise.all([
      api.get('/driver/available-lines').then((r) => setLines(r.data.data || r.data || [])).catch(() => {}),
      api.get('/driver/available-vehicles').then((r) => setVehicles(r.data.data || r.data || [])).catch(() => {}),
    ]).finally(() => setFetching(false));
  }, []);

  const handleStart = async () => {
    if (!selectedLine || !selectedVehicle) { Alert.alert('Error', 'Selecciona línea y vehículo'); return; }
    setLoading(true);
    try {
      const res = await api.post('/driver/start-journey', { line_id: selectedLine.id, vehicle_id: selectedVehicle.id });
      navigation.replace('ActiveJourney', { journey: res.data.data || res.data });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo iniciar');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <View style={styles.container}><ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Viaje</Text>
      <Text style={styles.subtitle}>Selecciona línea y vehículo</Text>

      <Text style={styles.sectionTitle}>Línea</Text>
      {lines.map((l) => (
        <Card key={l.id} onPress={() => setSelectedLine(l)} style={selectedLine?.id === l.id && styles.selected}>
          <Text style={styles.itemName}>{l.name}</Text>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Vehículo</Text>
      {vehicles.map((v) => (
        <Card key={v.id} onPress={() => setSelectedVehicle(v)} style={selectedVehicle?.id === v.id && styles.selected}>
          <Text style={styles.itemName}>{v.plate} {v.driver?.name && `- ${v.driver.name}`}</Text>
        </Card>
      ))}

      <Button title="Iniciar Viaje" onPress={handleStart} loading={loading} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginBottom: spacing.lg },
  sectionTitle: { ...typography.bodyBold, marginBottom: spacing.sm, marginTop: spacing.md },
  itemName: { ...typography.body },
  selected: { borderColor: colors.primary, borderWidth: 2 },
});
