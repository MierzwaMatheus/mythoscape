import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Sword, Crown, Footprints, Ghost, Skull, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface ToneOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
  themes: string[];
}

export default function ToneScreen() {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const toneOptions: ToneOption[] = [
    {
      id: 'heroic',
      name: 'Heroic Adventure',
      description: 'Epic quests and noble deeds in a world that needs heroes.',
      icon: Sword,
      image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
      themes: ['Combat', 'Glory', 'Honor'],
    },
    {
      id: 'political',
      name: 'Political Intrigue',
      description: 'Schemes, alliances, and power struggles in a complex world.',
      icon: Crown,
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg',
      themes: ['Diplomacy', 'Deception', 'Power'],
    },
    {
      id: 'exploration',
      name: 'Exploration & Discovery',
      description: 'Uncover ancient secrets and explore uncharted territories.',
      icon: Footprints,
      image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
      themes: ['Mystery', 'Adventure', 'Discovery'],
    },
    {
      id: 'horror',
      name: 'Dark & Horror',
      description: 'Face terrifying creatures and supernatural horrors.',
      icon: Ghost,
      image: 'https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg',
      themes: ['Horror', 'Survival', 'Mystery'],
    },
    {
      id: 'grim',
      name: 'Grim & Gritty',
      description: 'Survive in a harsh world where every choice has consequences.',
      icon: Skull,
      image: 'https://images.pexels.com/photos/6590699/pexels-photo-6590699.jpeg',
      themes: ['Survival', 'Morality', 'Conflict'],
    },
  ];

  const handleContinue = () => {
    if (!selectedTone) return;
    router.push('/campaigns/new/mode');
  };

  const renderToneCard = (tone: ToneOption) => {
    const Icon = tone.icon;
    const isSelected = selectedTone === tone.id;

    return (
      <Card 
        key={tone.id}
        style={[
          styles.toneCard,
          { 
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.toneContent}
          onPress={() => setSelectedTone(tone.id)}
        >
          <Image 
            source={{ uri: tone.image }} 
            style={styles.toneImage}
          />
          
          <View style={styles.toneOverlay}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <Icon size={24} color="#FFFFFF" />
            </View>
            
            <View style={styles.toneInfo}>
              <Text style={[styles.toneName, { color: '#FFFFFF' }]}>
                {tone.name}
              </Text>
              <Text 
                style={[styles.toneDescription, { color: '#FFFFFF' }]}
                numberOfLines={2}
              >
                {tone.description}
              </Text>
            </View>
            
            <ChevronRight size={24} color="#FFFFFF" />
          </View>
          
          <View style={styles.themesContainer}>
            {tone.themes.map((theme, index) => (
              <View 
                key={index}
                style={[styles.themeTag, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.themeText, { color: colors.primary }]}>
                  {theme}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Choose Your Adventure Tone
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Select the style and themes that will shape your campaign's narrative
        </Text>
      </View>

      <View style={styles.tonesContainer}>
        {toneOptions.map(renderToneCard)}
      </View>

      <Button
        title="Continue to Game Mode"
        onPress={handleContinue}
        disabled={!selectedTone}
        style={styles.continueButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Bitter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Exo-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  tonesContainer: {
    marginBottom: 24,
  },
  toneCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  toneContent: {
    width: '100%',
  },
  toneImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  toneOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toneInfo: {
    flex: 1,
    marginRight: 16,
  },
  toneName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  toneDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 12,
  },
  themeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  themeText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
  },
  continueButton: {
    marginTop: 8,
  },
});