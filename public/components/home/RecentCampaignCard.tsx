import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Clock } from 'lucide-react-native';

interface RecentCampaignCardProps {
  title: string;
  lastPlayed: string;
  progress: number;
  image: string;
  onPress: () => void;
}

const RecentCampaignCard: React.FC<RecentCampaignCardProps> = ({
  title,
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
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.lastPlayedContainer}>
          <Clock size={14} color={colors.textLight} />
          <Text style={[styles.lastPlayedText, { color: colors.textLight }]}>
            {lastPlayed}
          </Text>
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
    width: 240,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontFamily: 'Bitter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  lastPlayedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastPlayedText: {
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

export default RecentCampaignCard;