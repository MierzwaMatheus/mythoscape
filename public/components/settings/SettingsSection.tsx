import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.textLight }]}>
          {title}
        </Text>
      )}
      
      <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default SettingsSection;