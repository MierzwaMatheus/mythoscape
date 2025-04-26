import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Swords, Book, Heart, Brain, Star, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface Ancestry {
  id: string;
  name: string;
  description: string;
  image: string;
  traits: string[];
}

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  image: string;
  keyAbility: string;
  role: string;
}

interface Background {
  id: string;
  name: string;
  description: string;
  boosts: string[];
  skill: string;
  feat: string;
}

export default function CharacterScreen() {
  const [selectedAncestry, setSelectedAncestry] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const ancestries: Ancestry[] = [
    {
      id: '1',
      name: 'Human',
      description: 'Ambitious, versatile, and numerous, humans are the most common ancestry in most nations.',
      image: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg',
      traits: ['Adaptable', 'Versatile', 'Skilled'],
    },
    {
      id: '2',
      name: 'Elf',
      description: 'Long-lived and graceful, elves are known for their love of art, magic, and nature.',
      image: 'https://images.pexels.com/photos/6471840/pexels-photo-6471840.jpeg',
      traits: ['Keen Senses', 'Magic Affinity', 'Swift'],
    },
  ];

  const classes: CharacterClass[] = [
    {
      id: '1',
      name: 'Fighter',
      description: 'Masters of martial combat, capable of both offense and defense.',
      image: 'https://images.pexels.com/photos/7887822/pexels-photo-7887822.jpeg',
      keyAbility: 'Strength or Dexterity',
      role: 'Martial Combat',
    },
    {
      id: '2',
      name: 'Wizard',
      description: 'Scholarly magic-users who study arcane secrets to cast powerful spells.',
      image: 'https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg',
      keyAbility: 'Intelligence',
      role: 'Spellcasting',
    },
  ];

  const backgrounds: Background[] = [
    {
      id: '1',
      name: 'Scholar',
      description: 'You spent years learning about the world through academic study.',
      boosts: ['Intelligence', 'Wisdom'],
      skill: 'Arcana',
      feat: 'Assurance',
    },
    {
      id: '2',
      name: 'Soldier',
      description: 'You served in a military, learning the art of combat and discipline.',
      boosts: ['Strength', 'Constitution'],
      skill: 'Athletics',
      feat: 'Shield Block',
    },
  ];

  const handleContinue = () => {
    if (!selectedAncestry || !selectedClass || !selectedBackground) return;
    router.push('/campaigns/new/tone');
  };

  const renderAncestryCard = (ancestry: Ancestry) => (
    <Card 
      key={ancestry.id}
      style={[
        styles.selectionCard,
        { 
          borderColor: selectedAncestry === ancestry.id ? colors.primary : colors.border,
          borderWidth: selectedAncestry === ancestry.id ? 2 : 1,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.selectionContent}
        onPress={() => setSelectedAncestry(ancestry.id)}
      >
        <Image 
          source={{ uri: ancestry.image }} 
          style={styles.selectionImage}
        />
        <View style={styles.selectionInfo}>
          <Text style={[styles.selectionTitle, { color: colors.text }]}>
            {ancestry.name}
          </Text>
          <Text 
            style={[styles.selectionDescription, { color: colors.textLight }]}
            numberOfLines={2}
          >
            {ancestry.description}
          </Text>
          <View style={styles.traitsContainer}>
            {ancestry.traits.map((trait, index) => (
              <View 
                key={index}
                style={[styles.trait, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.traitText, { color: colors.primary }]}>
                  {trait}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <ChevronRight size={24} color={colors.textLight} />
      </TouchableOpacity>
    </Card>
  );

  const renderClassCard = (characterClass: CharacterClass) => (
    <Card 
      key={characterClass.id}
      style={[
        styles.selectionCard,
        { 
          borderColor: selectedClass === characterClass.id ? colors.primary : colors.border,
          borderWidth: selectedClass === characterClass.id ? 2 : 1,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.selectionContent}
        onPress={() => setSelectedClass(characterClass.id)}
      >
        <Image 
          source={{ uri: characterClass.image }} 
          style={styles.selectionImage}
        />
        <View style={styles.selectionInfo}>
          <Text style={[styles.selectionTitle, { color: colors.text }]}>
            {characterClass.name}
          </Text>
          <Text 
            style={[styles.selectionDescription, { color: colors.textLight }]}
            numberOfLines={2}
          >
            {characterClass.description}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Star size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {characterClass.keyAbility}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Swords size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {characterClass.role}
              </Text>
            </View>
          </View>
        </View>
        <ChevronRight size={24} color={colors.textLight} />
      </TouchableOpacity>
    </Card>
  );

  const renderBackgroundCard = (background: Background) => (
    <Card 
      key={background.id}
      style={[
        styles.selectionCard,
        { 
          borderColor: selectedBackground === background.id ? colors.primary : colors.border,
          borderWidth: selectedBackground === background.id ? 2 : 1,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.selectionContent}
        onPress={() => setSelectedBackground(background.id)}
      >
        <View style={[styles.backgroundIcon, { backgroundColor: colors.primaryLight }]}>
          <Book size={24} color={colors.primary} />
        </View>
        <View style={styles.selectionInfo}>
          <Text style={[styles.selectionTitle, { color: colors.text }]}>
            {background.name}
          </Text>
          <Text 
            style={[styles.selectionDescription, { color: colors.textLight }]}
            numberOfLines={2}
          >
            {background.description}
          </Text>
          <View style={styles.backgroundDetails}>
            <View style={styles.detailItem}>
              <Brain size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                Boosts: {background.boosts.join(', ')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Star size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                Skill: {background.skill}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Shield size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                Feat: {background.feat}
              </Text>
            </View>
          </View>
        </View>
        <ChevronRight size={24} color={colors.textLight} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose Your Ancestry
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textLight }]}>
          Your ancestry determines your character's heritage and natural abilities
        </Text>
        {ancestries.map(renderAncestryCard)}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose Your Class
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textLight }]}>
          Your class defines your character's primary abilities and role in the party
        </Text>
        {classes.map(renderClassCard)}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose Your Background
        </Text>
        <Text style={[styles.sectionDescription, { color: colors.textLight }]}>
          Your background represents your character's early life and training
        </Text>
        {backgrounds.map(renderBackgroundCard)}
      </View>

      <Button
        title="Continue to Adventure Tone"
        onPress={handleContinue}
        disabled={!selectedAncestry || !selectedClass || !selectedBackground}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  selectionCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  selectionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  backgroundIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  selectionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  selectionDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  trait: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  traitText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
  },
  statsContainer: {
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  backgroundDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  continueButton: {
    marginTop: 8,
  },
});