import { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { 
  Bitter_400Regular, 
  Bitter_700Bold 
} from '@expo-google-fonts/bitter';
import { 
  Exo_400Regular, 
  Exo_500Medium, 
  Exo_700Bold 
} from '@expo-google-fonts/exo';
import { View, Text, StyleSheet } from 'react-native';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Bitter-Regular': Bitter_400Regular,
    'Bitter-Bold': Bitter_700Bold,
    'Exo-Regular': Exo_400Regular,
    'Exo-Medium': Exo_500Medium,
    'Exo-Bold': Exo_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}