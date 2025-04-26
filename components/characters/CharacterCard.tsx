import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CharacterCardProps {
  name: string;
  ancestry: string;
  class: string;
  level: number;
  image: string;
  onPress: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  ancestry,
  class: characterClass,
  level,
  image,
  onPress,
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <View 
          style={[
            styles.levelBadge, 
            { backgroundColor: colors.primary }
          ]}
        >
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.name, { color: colors.text }]}>
          {name}
        </Text>
        
        <Text style={[styles.details, { color: colors.textLight }]}>
          {ancestry} {characterClass}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontFamily: 'Exo-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  details: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
  },
});

export default CharacterCard;