export const colors = {
  primary: '#000000',
  secondary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  grayLight: '#F5F5F5',
  border: '#E6E6E6',
  textPrimary: '#000000',
  textSecondary: '#7D7D7D',
  error: '#C0392B',
  success: '#2ECC71',
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  small: { fontSize: 11, fontWeight: '500' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const shadows = {
  none: { elevation: 0, shadowOpacity: 0 },
  subtle: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
};

const theme = { colors, typography, spacing, borderRadius, shadows };
export default theme;
