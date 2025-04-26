import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Clock, Users } from 'lucide-react-native';

interface CampaignCardProps {
  title: string;
  description: string;
  players: number;
  lastPlayed: string;
  progress: number;
  image: string;
  onPress: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  description,
  players,
  lastPlayed,
  progress,
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
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        
        <Text 
          style={[styles.description, { color: colors.textLight }]}
          numberOfLines={2}
        >
          {description}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Users size={14} color={colors.textLight} />
            <Text style={[styles.metaText, { color: colors.textLight }]}>
              {players} players
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={[styles.metaText, { color: colors.textLight }]}>
              {lastPlayed}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.accent,
                  width: `${progress}%` 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textLight }]}>
            {progress}%
          </Text>
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
  },
  title: {
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
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
    width: 32,
  },
});

export default CampaignCard;