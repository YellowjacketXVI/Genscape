import React from 'react';
import { StyleSheet, ScrollView, View, Platform, Dimensions, ScrollViewProps, useWindowDimensions } from 'react-native';
import Colors from '@/constants/Colors';

type ThemedScrollViewProps = ScrollViewProps & {
  children: React.ReactNode;
};

export default function ThemedScrollView({ children, ...props }: ThemedScrollViewProps) {
  // Only apply custom scrollbar on web platform for desktop
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isWeb = Platform.OS === 'web';

  if (isWeb && isDesktop) {
    // For web, we can use CSS to style the scrollbar
    return (
      <ScrollView
        {...props}
        style={[styles.scrollViewWeb, props.style]}
        contentContainerStyle={[styles.contentContainer, props.contentContainerStyle]}
      >
        {children}
      </ScrollView>
    );
  }

  // For native platforms, use regular ScrollView
  return (
    <ScrollView
      {...props}
      style={[styles.scrollView, props.style]}
      contentContainerStyle={[styles.contentContainer, props.contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewWeb: {
    flex: 1,
    width: '100%',
    // These styles will be applied only on web
    // The actual scrollbar styling is done in the global CSS
  },
  contentContainer: {
    // Add any default content container styles here
    width: '100%',
  },
});

// Add this to your global CSS or inject it for web platform
if (Platform.OS === 'web') {
  // Use useEffect to ensure this only runs in the browser
  React.useEffect(() => {
    // Create a style element
    const style = document.createElement('style');

    // Define the scrollbar styles
    style.textContent = `
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: ${Colors.background.dark};
      }

      ::-webkit-scrollbar-thumb {
        background: ${Colors.background.medium};
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${Colors.primary};
      }

      /* For Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: ${Colors.background.medium} ${Colors.background.dark};
      }
    `;

    // Append the style to the document head
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array means this runs once on mount
}
