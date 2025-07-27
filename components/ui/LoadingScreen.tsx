import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
