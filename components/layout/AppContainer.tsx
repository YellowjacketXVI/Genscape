import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Colors from '@/constants/Colors';

type AppContainerProps = {
  children: React.ReactNode;
};

export default function AppContainer({ children }: AppContainerProps) {
  // Detect if we're on desktop or mobile
  const isDesktop = Dimensions.get('window').width > 768;

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: isDesktop ? 12 : 6 }
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
});
