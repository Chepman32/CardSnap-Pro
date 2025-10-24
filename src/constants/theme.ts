/**
 * Theme Constants
 * Colors, spacing, typography, and other design tokens
 */

export const Colors = {
  // Brand Colors
  brandPrimary: '#16A085',
  brandSecondary: '#1ABC9C',
  brandDark: '#1a1a2e',
  brandLight: '#0f3460',

  // UI Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F8FA',
  backgroundTertiary: '#F2F2F7',

  // Text Colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLight: '#FFFFFF',

  // Status Colors
  success: '#16A085',
  successLight: 'rgba(22, 160, 133, 0.1)',
  warning: '#FFC107',
  warningLight: 'rgba(255, 193, 7, 0.1)',
  error: '#F44336',
  errorLight: 'rgba(244, 67, 54, 0.1)',
  info: '#2196F3',
  infoLight: 'rgba(33, 150, 243, 0.1)',

  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Social Colors
  linkedin: '#0077B5',
  twitter: '#000000',
  instagram: '#E1306C',
  facebook: '#1877F2',

  // Premium
  premium: '#FFD700',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const HitSlop = {
  small: {top: 8, bottom: 8, left: 8, right: 8},
  medium: {top: 12, bottom: 12, left: 12, right: 12},
  large: {top: 16, bottom: 16, left: 16, right: 16},
};
