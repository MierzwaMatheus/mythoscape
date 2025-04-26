import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define theme types
type ThemeType = 'light' | 'dark';

// Mock secure store for web platform
const webStore: Record<string, string> = {};

const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    webStore[key] = value;
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return webStore[key] || null;
  }
  return await SecureStore.getItemAsync(key);
};

// Color palettes
const lightColors = {
  primary: '#5C4D7D',
  primaryLight: '#7A678F',
  secondary: '#A6E1FA',
  secondaryLight: '#C4EBFC',
  accent: '#FFB74D',
  accentLight: '#FFCF7E',
  background: '#F4F6F8',
  cardBackground: '#FFFFFF',
  text: '#1A1A2E',
  textLight: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  shadow: '#000000',
  disabledBackground: '#E5E7EB',
  disabledText: '#9CA3AF',
};

const darkColors = {
  primary: '#6D5E99',
  primaryLight: '#8C7AAF',
  secondary: '#88C8E8',
  secondaryLight: '#A6D7F0',
  accent: '#FFA726',
  accentLight: '#FFB74D',
  background: '#1A1A2E',
  cardBackground: '#2A2A3E',
  text: '#F4F6F8',
  textLight: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  errorLight: '#401E1E',
  success: '#34D399',
  successLight: '#1E402A',
  warning: '#FBBF24',
  warningLight: '#3F2E1A',
  info: '#60A5FA',
  infoLight: '#1E2A40',
  shadow: '#000000',
  disabledBackground: '#374151',
  disabledText: '#6B7280',
};

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme() as ThemeType;
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on startup
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getData('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        } else {
          // If no saved theme, use device theme
          setThemeState(deviceColorScheme || 'light');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceColorScheme]);

  // Save theme change
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await storeData('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Determine current color palette
  const colors = theme === 'light' ? lightColors : darkColors;

  // Provide theme context
  const value = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  if (isLoading) {
    // You could return a splash screen or loading indicator here
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};