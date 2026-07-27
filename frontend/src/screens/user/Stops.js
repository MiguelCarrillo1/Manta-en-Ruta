import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { publicService } from '../../services/publicService';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Stops() {
  const [stops, setStops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
    publicService.getStops().then((res) => {
      const d = res.data.data || res.data || [];
      const sorted = userLoc
        ? d.map((s) => ({ ...s, dist: haversine(userLoc.lat, userLoc.lng, parseFloat(s.latitude), parseFloat(s.longitude)) })).sort((a, b) => a.dist - b.dist)
        : d;
      setStops(sorted);
      setFiltered(sorted);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(stops); return; }
    const q = search.toLowerCase();
    setFiltered(stops.filter((s) => (s.name || '').toLowerCase().includes(q)));
  }, [search, stops]);

  const formatDist = (km) => km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paradas</Text>
        <TextInput style={styles.search} placeholder="Buscar parada..." value={search} onChangeText={setSearch} placeholderTextColor={colors.textSecondary} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            let dist = null;
            if (userLoc && item.latitude && item.longitude) {
              dist = item.dist ?? haversine(userLoc.lat, userLoc.lng, parseFloat(item.latitude), parseFloat(item.longitude));
            }
            return (
              <Card onPress={() => navigation.navigate('StopDetail', { ...item, userLoc })}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stopName}>{item.name}</Text>
                    {item.address && <Text style={styles.stopAddr}>{item.address}</Text>}
                  </View>
                  {dist !== null && <Text style={styles.dist}>{formatDist(dist)}</Text>}
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.md, letterSpacing: -0.5 },
  search: { height: 44, backgroundColor: colors.grayLight, borderRadius: 14, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.textPrimary },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  row: { flexDirection: 'row', alignItems: 'center' },
  stopName: { ...typography.bodyBold },
  stopAddr: { ...typography.caption, marginTop: 2 },
  dist: { ...typography.small, color: '#2ECC71', fontWeight: '600' },
});
