import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { driverService } from '../../services/driverService';
import { useAuthStore } from '../../store';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function ActiveJourney() {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ac, setAc] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const loadJourney = useCallback(async () => {
    try {
      const res = await driverService.getActiveJourney();
      const d = res.data.data || res.data;
      if (d?.id) {
        setJourney(d);
        setAc(!!d.vehicle?.ac_status);
        setWifi(!!d.vehicle?.wifi_status);
        setStartKm(String(d.start_km || ''));
        if (d.end_km) setEndKm(String(d.end_km));
        if (d.start_at) {
          const start = new Date(d.start_at).getTime();
          setElapsed(Math.floor((Date.now() - start) / 1000));
        }
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadJourney(); }, [loadJourney]);
  useEffect(() => {
    if (!journey) return;
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [journey]);

  const toggleFeature = async (key, value) => {
    try {
      if (key === 'ac') {
        if (journey?.vehicle?.id) await driverService.toggleAC(journey.vehicle.id);
        setAc(value);
      } else {
        if (journey?.vehicle?.id) await driverService.toggleWiFi(journey.vehicle.id);
        setWifi(value);
      }
    } catch {}
  };

  const handleFinish = async () => {
    if (!endKm) { Alert.alert('Error', 'Ingresa el kilometraje final'); return; }
    setSaving(true);
    try {
      await driverService.finishJourney({
        end_km: parseInt(endKm, 10),
      });
      await loadJourney();
      Alert.alert('Viaje finalizado');
    } catch (e) { Alert.alert('Error', 'No se pudo finalizar'); }
    finally { setSaving(false); }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;

  if (!journey) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Iniciar Viaje</Text>
        <Text style={styles.label}>Kilometraje inicial</Text>
        <TextInput style={styles.input} placeholder="Ej: 1250" value={startKm} onChangeText={setStartKm} keyboardType="number-pad" placeholderTextColor="#999" />
        <Text style={styles.label}>Unidad</Text>
        <Text style={styles.value}>Selecciona desde Mi Ruta</Text>
        <Button title="Ir a Mi Ruta" onPress={() => navigation.navigate('DriverMap')} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Viaje Activo</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      </View>

      <Card>
        <Text style={styles.label}>Línea</Text>
            <Text style={styles.value}>{journey.vehicle?.line?.name || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Vehículo</Text>
        <Text style={styles.value}>{journey.vehicle?.plate || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Km Inicial</Text>
        <Text style={styles.value}>{journey.start_km ?? (startKm || '—')}</Text>
      </Card>

      <View style={styles.toggles}>
        <TouchableOpacity style={[styles.toggle, ac && styles.toggleActive]} onPress={() => toggleFeature('ac', !ac)}>
          <Text style={styles.toggleIcon}>❄️</Text>
          <Text style={[styles.toggleLabel, ac && styles.toggleLabelActive]}>{ac ? 'AC ON' : 'AC OFF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, wifi && styles.toggleActive]} onPress={() => toggleFeature('wifi', !wifi)}>
          <Text style={styles.toggleIcon}>📶</Text>
          <Text style={[styles.toggleLabel, wifi && styles.toggleLabelActive]}>{wifi ? 'WiFi ON' : 'WiFi OFF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, maintenance && styles.toggleActive]} onPress={() => setMaintenance(!maintenance)}>
          <Text style={styles.toggleIcon}>🔧</Text>
          <Text style={[styles.toggleLabel, maintenance && styles.toggleLabelActive]}>{maintenance ? 'En Mantención' : 'Operativo'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Finalizar Viaje</Text>
      <Text style={styles.label}>Km Final</Text>
      <TextInput style={styles.input} placeholder="Ej: 1300" value={endKm} onChangeText={setEndKm} keyboardType="number-pad" placeholderTextColor="#999" />
      <Button title="✅ Finalizar Viaje" onPress={handleFinish} loading={saving} style={{ marginTop: spacing.md }} />

      <View style={styles.actions}>
        <Button title="⛽ Registrar Combustible" onPress={() => navigation.navigate('FuelRegister')} variant="secondary" style={{ marginBottom: spacing.sm }} />
        <Button title="🆘 Emergencia" onPress={() => navigation.navigate('EmergencyReport')} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxxl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: 22, fontWeight: '700' },
  timer: { fontSize: 48, fontWeight: '700', letterSpacing: 2, marginTop: spacing.sm, fontVariant: ['tabular-nums'] },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs, marginTop: spacing.md },
  value: { ...typography.body, marginBottom: spacing.xs },
  input: { height: 50, backgroundColor: colors.grayLight, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginTop: spacing.xl, marginBottom: spacing.sm },
  toggles: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.xl },
  toggle: { flex: 1, height: 72, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  toggleActive: { borderColor: colors.primary, backgroundColor: colors.grayLight },
  toggleIcon: { fontSize: 20, marginBottom: spacing.xs },
  toggleLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  toggleLabelActive: { color: colors.primary, fontWeight: '700' },
  actions: { marginTop: spacing.lg },
});
