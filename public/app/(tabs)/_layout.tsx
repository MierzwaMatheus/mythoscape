import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, Users, Map, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import TabBarIcon from '@/components/common/TabBarIcon';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Exo-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontFamily: 'Bitter-Bold',
          fontSize: 18,
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Home} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: 'Campaigns',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={BookOpen} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: 'Characters',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Users} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="world"
        options={{
          title: 'World',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Map} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={Settings} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}