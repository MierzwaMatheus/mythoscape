import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function AuthIndex() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to main app
    if (session) {
      router.replace('/(tabs)');
    } else if (!isLoading) {
      router.replace('/login');
    }
  }, [session, isLoading]);

  // Show loading screen while checking authentication status
  return <LoadingScreen />;
}