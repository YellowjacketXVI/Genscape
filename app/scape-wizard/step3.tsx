import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function Step3Redirect() {
  const router = useRouter();
  
  // Redirect to the new scape-edit path
  useEffect(() => {
    // Short delay to ensure the redirect happens after component mount
    const timer = setTimeout(() => {
      router.replace('/scape-edit/new');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to the new Scape Editor...</Text>
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
