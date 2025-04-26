import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#F4F6F8' }
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="api-key" />
    </Stack>
  );
}