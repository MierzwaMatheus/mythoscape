import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  onPress: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  backgroundColor,
  onPress,
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: backgroundColor || colors.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <span style={styles.iconContainer}>{icon}</span>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Exo-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ActionCard;