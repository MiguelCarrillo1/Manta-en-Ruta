import { View, TextInput, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../../theme';

export default function Input({ icon, containerStyle, ...props }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.md,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  iconWrap: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, height: '100%' },
  inputWithIcon: {},
});
