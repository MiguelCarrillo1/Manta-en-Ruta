import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, borderRadius, typography } from '../../theme';

export default function Button({ title, onPress, loading, disabled, variant = 'primary', style }) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.base, isPrimary ? styles.primary : styles.secondary, style]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.secondary : colors.primary} />
      ) : (
        <Text style={[isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { height: 50, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border },
  primaryText: { color: colors.secondary, fontSize: 15, fontWeight: '600' },
  secondaryText: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
