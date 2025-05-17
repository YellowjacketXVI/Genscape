import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler'; // Import gesture handler
import { ScapeProvider } from '@/contexts/ScapeContext';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      onLayoutRootView();
    }
  }, [fontsLoaded, fontError, onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ScapeProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="generate" options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Generate',
            headerStyle: {
              backgroundColor: '#1A1A1A',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontFamily: 'Inter-Medium',
            },
          }} />
          <Stack.Screen name="lora-studio" options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'LoRA Studio',
            headerStyle: {
              backgroundColor: '#1A1A1A',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontFamily: 'Inter-Medium',
            },
          }} />
          <Stack.Screen name="scape-edit" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </>
    </ScapeProvider>
  );
}