import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Logo size={120} />
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        style={styles.spinner} 
      />
      <Text style={[styles.message, { color: colors.text }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  spinner: {
    marginTop: 32,
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Exo-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingScreen;