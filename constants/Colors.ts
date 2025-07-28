// Legacy Colors - Use theme/index.ts for new components
import { colors } from '@/theme';

const tintColorLight = colors.primary;
const tintColorDark = colors.primary;

export default {
  light: {
    text: '#1A1A1A',
    background: '#F7F7F7',
    tint: tintColorLight,
    tabIconDefault: '#888',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
  },
  dark: {
    text: colors.textPrimary,
    background: colors.background,
    tint: tintColorDark,
    tabIconDefault: colors.textMuted,
    tabIconSelected: tintColorDark,
    cardBackground: colors.surface,
  },
  // Updated to use new theme colors
  primary: colors.primary,
  background: {
    dark: colors.background,
    medium: colors.surface,
    light: colors.cardBackground,
  },
  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
  }
};