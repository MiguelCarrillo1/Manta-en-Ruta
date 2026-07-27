import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const menuItems = [
  { title: 'Gestionar Líneas', screen: 'ManageLines', icon: '🚌' },
  { title: 'Gestionar Paradas', screen: 'ManageStops', icon: '📍' },
  { title: 'Gestionar POIs', screen: 'ManagePois', icon: '🏛️' },
  { title: 'Alertas', screen: 'Alerts', icon: '🔔' },
  { title: 'Mantenimiento', screen: 'Maintenance', icon: '🔧' },
  { title: 'Estadísticas', screen: 'CoopStatistics', icon: '📊' },
  { title: 'Emergencias', screen: 'Emergencies', icon: '🆘' },
  { title: 'Historial Combustible', screen: 'FuelHistory', icon: '⛽' },
];

export default function CoopMenu() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Menú</Text>
      {menuItems.map((item) => (
        <TouchableOpacity key={item.screen} style={styles.card} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.text}>{item.title}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.xl, letterSpacing: -0.5 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  icon: { fontSize: 24, marginRight: spacing.lg },
  text: { ...typography.body, flex: 1 },
  arrow: { fontSize: 20, color: colors.textSecondary },
});
