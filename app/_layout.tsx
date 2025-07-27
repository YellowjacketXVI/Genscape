import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

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
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
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
          <Stack.Screen name="scape-wizard" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </AuthGuard>
    </AuthProvider>
  );
}