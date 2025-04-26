import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function NewCampaignLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTitleStyle: {
          fontFamily: 'Bitter-Bold',
          color: colors.text,
        },
        headerTintColor: colors.primary,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Create Campaign',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="scenario"
        options={{
          title: 'Choose Scenario',
        }}
      />
      <Stack.Screen
        name="character"
        options={{
          title: 'Create Character',
        }}
      />
      <Stack.Screen
        name="tone"
        options={{
          title: 'Adventure Tone',
        }}
      />
      <Stack.Screen
        name="mode"
        options={{
          title: 'Game Mode',
        }}
      />
      <Stack.Screen
        name="duration"
        options={{
          title: 'Campaign Duration',
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          title: 'Review Campaign',
        }}
      />
    </Stack>
  );
}