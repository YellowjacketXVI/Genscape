import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface FeedLayoutProps {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.feedColumn}>
        {children}
      </View>
    </View>
  );
}

// Card component with responsive dimensions
interface FeedCardProps {
  children: React.ReactNode;
  style?: any;
}

export function FeedCard({ children, style }: FeedCardProps) {
  const theme = useTheme();

  // Responsive card sizing
  const MAX_CARD_SIZE = 600;
  const HORIZONTAL_PADDING = 32; // 16px on each side

  const cardWidth = Math.min(MAX_CARD_SIZE, screenWidth - HORIZONTAL_PADDING);
  const cardHeight = Math.min(MAX_CARD_SIZE, cardWidth * 0.88); // Maintain aspect ratio on small screens

  const cardStyle = {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    paddingHorizontal: 16,
  },
  feedColumn: {
    flex: 1,
    width: '100%',
    maxWidth: 600 + 32, // Max card width + padding
    alignSelf: 'center',
  },
});
