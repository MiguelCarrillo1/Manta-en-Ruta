import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

export default function Card({ children, onPress, style, noBorder }) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      style={[styles.card, noBorder && styles.noBorder, shadows.subtle, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  noBorder: { borderWidth: 0 },
});
