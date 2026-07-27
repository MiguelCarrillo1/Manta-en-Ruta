import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useAuthStore } from '../../store';
import { publicService } from '../../services/publicService';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const formatDist = (km) => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

export default function UserHome() {
  const [lines, setLines] = useState([]);
  const [stops, setStops] = useState([]);
  const [activeBuses, setActiveBuses] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    } catch {}
    try {
      const [linesRes, stopsRes, busesRes] = await Promise.all([
        publicService.getLines().catch(() => ({ data: { data: [] } })),
        publicService.getStops().catch(() => ({ data: { data: [] } })),
        userService.getActiveBuses().catch(() => ({ data: { data: [] } })),
      ]);
      setLines(linesRes.data.data || linesRes.data || []);
      setStops(stopsRes.data.data || stopsRes.data || []);
      setActiveBuses(busesRes.data.data || busesRes.data || []);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const nearbyStops = userLoc
    ? stops.map((s) => ({ ...s, dist: haversine(userLoc.lat, userLoc.lng, parseFloat(s.latitude), parseFloat(s.longitude)) }))
        .filter((s) => s.dist < 2).sort((a, b) => a.dist - b.dist).slice(0, 5)
    : [];

  const sections = [];
  if (nearbyStops.length > 0) {
    sections.push({ title: 'Paradas Cercanas', data: nearbyStops, key: 'nearbyStops', navigateTo: 'Stops', detailKey: 'StopDetail', nameKey: 'name', renderRight: (s) => <Text style={styles.dist}>{formatDist(s.dist)}</Text> });
  }
  sections.push({ title: 'Líneas', data: lines.slice(0, 5), key: 'lines', navigateTo: 'Lines', detailKey: 'LineDetail', nameKey: 'name' });
  if (activeBuses.length > 0) {
    sections.push({ title: 'Buses Activos', data: activeBuses.slice(0, 5), key: 'activeBuses', navigateTo: 'BusTracker', detailKey: 'BusDetail', nameKey: 'plate' });
  }
  sections.push({ title: 'Paradas', data: stops.slice(0, 5), key: 'stops', navigateTo: 'Stops', detailKey: 'StopDetail', nameKey: 'name' });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bienvenido, {user?.name?.split(' ')[0] || 'Usuario'}</Text>
        <Text style={styles.subtitle}>¿A dónde vamos hoy?</Text>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <Text style={styles.seeAll} onPress={() => navigation.navigate(item.navigateTo)}>Ver todo</Text>
            </View>
            {item.data.map((entry, idx) => (
              <Card key={idx} onPress={() => navigation.navigate(item.detailKey, entry)}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{entry[item.nameKey] || entry.name}</Text>
                    {(entry.description || entry.address) && <Text style={styles.cardDesc} numberOfLines={1}>{entry.description || entry.address}</Text>}
                  </View>
                  {item.renderRight?.(entry)}
                </View>
              </Card>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  greeting: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { ...typography.caption, marginTop: spacing.xs },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  seeAll: { ...typography.caption, fontWeight: '600' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardDesc: { fontSize: 13, color: '#7D7D7D', marginTop: spacing.xs },
  dist: { ...typography.small, color: '#2ECC71', fontWeight: '600' },
});
