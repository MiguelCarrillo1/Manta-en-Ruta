import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import { driverService } from '../../services/driverService';

export default function DriverHome() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();
  const [activeJourney, setActiveJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveJourney();
  }, []);

  const loadActiveJourney = async () => {
    try {
      const res = await driverService.getActiveJourney();
      setActiveJourney(res.data);
    } catch {
      setActiveJourney(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <ActivityIndicator style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido, {user?.name}</Text>

      {activeJourney ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Viaje Activo</Text>
          <Text>Vehículo: {activeJourney.vehicle?.plate || 'N/A'}</Text>
          <Text>Inicio: {new Date(activeJourney.start_time).toLocaleTimeString()}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FuelRegister')}>
            <Text style={styles.buttonText}>Registrar Combustible</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sin viaje activo</Text>
          <Text>Inicia un nuevo viaje para comenzar</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StartJourney')}>
            <Text style={styles.buttonText}>Iniciar Viaje</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.emergencyBtn} onPress={() => navigation.navigate('EmergencyReport')}>
        <Text style={styles.emergencyText}>Reportar Emergencia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center' },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  button: { backgroundColor: '#1a73e8', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  emergencyBtn: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  emergencyText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { marginTop: 'auto', padding: 12, alignItems: 'center' },
  logoutText: { color: '#e74c3c', fontWeight: 'bold' },
});
