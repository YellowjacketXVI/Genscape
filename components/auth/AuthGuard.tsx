import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!initialized || loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inProtectedGroup = segments[0] === '(tabs)' || segments[0] === 'creator-dashboard' || segments[0] === 'generate' || segments[0] === 'lora-studio' || segments[0] === 'scape-wizard';
    const isRootPath = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');

    if (!user && (inProtectedGroup || isRootPath)) {
      // User is not signed in and trying to access protected route or root
      router.replace('/auth/login');
    } else if (user && (inAuthGroup || isRootPath)) {
      // User is signed in and trying to access auth routes or root
      router.replace('/home');
    }
  }, [user, segments, initialized, loading]);

  // Show loading screen while checking authentication
  if (!initialized || loading) {
    return <LoadingScreen message="Initializing..." />;
  }

  return <>{children}</>;
}
