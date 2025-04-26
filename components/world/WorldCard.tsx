import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MapPin, ChevronRight } from 'lucide-react-native';

interface WorldCardProps {
  name: string;
  description: string;
  locationCount: number;
  image: string;
  onPress: () => void;
}

const WorldCard: React.FC<WorldCardProps> = ({
  name,
  description,
  locationCount,
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
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: colors.text }]}>
            {name}
          </Text>
          
          <Text 
            style={[styles.description, { color: colors.textLight }]}
            numberOfLines={2}
          >
            {description}
          </Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.textLight} />
            <Text style={[styles.locationText, { color: colors.textLight }]}>
              {locationCount} locations
            </Text>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <ChevronRight size={24} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default WorldCard;