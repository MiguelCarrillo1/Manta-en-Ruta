import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

const TAB_LABELS = {
  LiveLocationMap: { label: 'Ubicación', icon: '📍' },
  UserHome: { label: 'Inicio', icon: '🏠' },
  Lines: { label: 'Líneas', icon: '🚌' },
  Map: { label: 'Rutas', icon: '🗺️' },
  Stops: { label: 'Paradas', icon: '📍' },
  Profile: { label: 'Perfil', icon: '👤' },
  ActiveJourney: { label: 'Viaje', icon: '🚍' },
  DriverHistory: { label: 'Historial', icon: '🕐' },
  GuestMap: { label: 'Mapa', icon: '🗺️' },
  GuestLines: { label: 'Líneas', icon: '🚌' },
  GuestStops: { label: 'Paradas', icon: '📍' },
  DriverMap: { label: 'Mi Ruta', icon: '🗺️' },
  Monitor: { label: 'Monitoreo', icon: '📍' },
  Assign: { label: 'Asignar', icon: '🚌' },
};

export default function BottomTab({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const tab = TAB_LABELS[route.name] || { label: route.name, icon: '📄' };
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
            <Text style={[styles.icon, isFocused && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.4, marginBottom: 2 },
  iconActive: { opacity: 1 },
  label: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  labelActive: { color: colors.primary, fontWeight: '600' },
});
