import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = false; // Replace with actual auth check
    
    if (isAuthenticated) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null; // This component doesn't render anything
}
