// Global Theme System for Genscape.art
export const colors = {
  background: '#0A0A0A',
  surface: '#141414',
  primary: '#FF774C',    // for buttons and highlights
  secondary: '#A3A3A3',  // for icons and secondary text
  accent: '#00B589',     // shop/active states
  error: '#E03A3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#AFAFAF',
  textMuted: '#666666',
  
  // Additional semantic colors
  border: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.8)',
  success: '#22C55E',
  warning: '#F59E0B',
  
  // Card and surface variations
  cardBackground: '#1A1A1A',
  cardBorder: '#2A2A2A',
  inputBackground: '#1F1F1F',
  inputBorder: '#333333',
  
  // Status colors
  online: '#22C55E',
  offline: '#6B7280',
  live: '#EF4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const layout = {
  // Screen padding
  screenPadding: spacing.md,
  
  // Card dimensions
  feedCardWidth: 593,
  feedCardHeight: 524,
  feedCardSpacing: spacing.lg,
  
  // Header heights
  headerHeight: 60,
  tabBarHeight: 80,
  
  // Common dimensions
  buttonHeight: 48,
  inputHeight: 48,
  avatarSizes: {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Complete theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  layout,
  animation,
  breakpoints,
};

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
