import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors, typography, spacing } from '../../theme';

export default function StopDetail({ route }) {
  const stop = route.params;
  const userLoc = stop.userLoc;
  const stopLat = parseFloat(stop.latitude);
  const stopLng = parseFloat(stop.longitude);

  const region = {
    latitude: stopLat,
    longitude: stopLng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: stopLat, longitude: stopLng }} title={stop.name} pinColor="blue" />
        {userLoc && <Marker coordinate={{ latitude: userLoc.lat, longitude: userLoc.lng }} title="Tu ubicación" pinColor="red" />}
      </MapView>
      <View style={styles.info}>
        <Text style={styles.name}>{stop.name}</Text>
        {stop.address && <Text style={styles.address}>{stop.address}</Text>}
        {userLoc && (
          <Text style={styles.dist}>
            A {Math.round(haversine(userLoc.lat, userLoc.lng, stopLat, stopLng) * 1000)} m de ti
          </Text>
        )}
      </View>
    </View>
  );
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { width: Dimensions.get('window').width, height: 300 },
  info: { padding: spacing.xl },
  name: { fontSize: 24, fontWeight: '700', marginBottom: spacing.xs },
  address: { ...typography.caption, marginBottom: spacing.sm },
  dist: { ...typography.body, color: colors.success, fontWeight: '600', marginTop: spacing.sm },
});
