import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { colors, typography, spacing } from '../../theme';

export default function DriverHome() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const fetch = async () => {
    try {
      const res = await api.get('/driver/active-journey');
      const data = res.data.data || res.data;
      setJourneys(data?.id ? [data] : []);
    } catch (e) { setJourneys([]); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0]}</Text>
        <Text style={styles.subtitle}>Panel del Conductor</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={journeys}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin viaje activo</Text>
              <Text style={styles.emptyDesc}>Inicia un nuevo viaje</Text>
              <Button title="Iniciar Viaje" onPress={() => navigation.navigate('StartJourney')} style={{ marginTop: spacing.lg }} />
            </View>
          }
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <View>
                  <Text style={styles.lineName}>{item.line?.name}</Text>
                  <Text style={styles.plate}>{item.vehicle?.plate}</Text>
                </View>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Button title="Ver Viaje" onPress={() => navigation.navigate('ActiveJourney')} style={{ marginTop: spacing.md }} />
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  greeting: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyTitle: { ...typography.h3, marginBottom: spacing.xs },
  emptyDesc: { ...typography.caption },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lineName: { ...typography.bodyBold },
  plate: { ...typography.caption },
  status: { ...typography.small, color: colors.success, textTransform: 'capitalize' },
});
