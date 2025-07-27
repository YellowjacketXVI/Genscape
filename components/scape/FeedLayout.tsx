import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface FeedLayoutProps {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.feedColumn}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    paddingLeft: 36, // 36px left padding as specified
  },
  feedColumn: {
    flex: 1,
    alignItems: 'flex-end', // Right-align the content
    paddingRight: 16, // Some padding from the right edge
  },
});

// Card component with specified dimensions
interface FeedCardProps {
  children: React.ReactNode;
  style?: any;
}

export function FeedCard({ children, style }: FeedCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

// Add card styles to the main styles object
const cardStyles = {
  card: {
    width: 593, // Fixed width as specified
    height: 524, // Fixed height as specified
    backgroundColor: Colors.background.medium,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    // Ensure card doesn't exceed screen width on smaller devices
    maxWidth: screenWidth - 52, // Account for left padding (36) + right padding (16)
  },
};

// Merge with main styles
Object.assign(styles, cardStyles);
