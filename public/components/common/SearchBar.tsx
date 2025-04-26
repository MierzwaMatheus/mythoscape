import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  icon,
  style
}) => {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
        style
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[
          styles.input,
          { 
            color: colors.text,
            paddingLeft: icon ? 0 : 16,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Exo-Regular',
    fontSize: 16,
  },
});

export default SearchBar;