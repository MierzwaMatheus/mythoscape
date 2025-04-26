import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookOpenText } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 48,
  color
}) => {
  const { colors } = useTheme();
  const logoColor = color || colors.primary;
  
  return (
    <View style={[
      styles.container,
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: `${logoColor}20`, // 20% opacity
      }
    ]}>
      <BookOpenText size={size * 0.6} color={logoColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo;