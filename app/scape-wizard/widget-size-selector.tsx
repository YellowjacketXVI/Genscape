import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function WidgetSizeSelectorRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Redirect to the new scape-edit widget size selector path
  useEffect(() => {
    // Short delay to ensure the redirect happens after component mount
    const timer = setTimeout(() => {
      // Pass along any parameters that were provided
      router.replace({
        pathname: '/scape-edit/widget-size-selector',
        params
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router, params]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to the new Widget Size Selector...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.dark,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
