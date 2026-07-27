import { View, Text, StyleSheet } from 'react-native';
import Card from '../../components/ui/Card';
import { colors, typography, spacing } from '../../theme';

export default function BusDetail({ route }) {
  const bus = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Vehículo</Text>
      <Card>
        <Text style={styles.label}>Placa</Text>
        <Text style={styles.value}>{bus.plate || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Marca / Modelo</Text>
        <Text style={styles.value}>{bus.brand || bus.model || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Conductor</Text>
        <Text style={styles.value}>{bus.driver?.name || 'Sin asignar'}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: spacing.xl, letterSpacing: -0.5 },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { ...typography.body, marginBottom: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});
