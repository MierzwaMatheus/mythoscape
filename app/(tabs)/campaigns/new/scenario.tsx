import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

type ScenarioType = 'preset' | 'generated';

interface Scenario {
  id: string;
  title: string;
  description: string;
  image: string;
  level: string;
}

export default function ScenarioScreen() {
  const [selectedType, setSelectedType] = useState<ScenarioType | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const presetScenarios: Scenario[] = [
    {
      id: '1',
      title: 'The Fall of Plaguestone',
      description: 'A small town mystery turns into a dangerous investigation of murder and corruption.',
      image: 'https://images.pexels.com/photos/6469077/pexels-photo-6469077.jpeg',
      level: '1-4',
    },
    {
      id: '2',
      title: 'Troubles in Otari',
      description: 'Explore the coastal town of Otari and the mysterious dungeons beneath it.',
      image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
      level: '1-3',
    },
  ];

  const handleContinue = () => {
    if (!selectedType) return;
    router.push('/campaigns/new/character');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Choose Your Scenario
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Select a pre-made adventure or let AI create a unique scenario for you
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            { 
              backgroundColor: colors.cardBackground,
              borderColor: selectedType === 'preset' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => setSelectedType('preset')}
        >
          <BookOpen 
            size={32} 
            color={selectedType === 'preset' ? colors.primary : colors.text} 
          />
          <Text style={[
            styles.optionTitle, 
            { color: selectedType === 'preset' ? colors.primary : colors.text }
          ]}>
            Pre-made Scenario
          </Text>
          <Text style={[styles.optionDescription, { color: colors.textLight }]}>
            Choose from official Pathfinder 2e adventures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            { 
              backgroundColor: colors.cardBackground,
              borderColor: selectedType === 'generated' ? colors.primary : colors.border,
            }
          ]}
          onPress={() => setSelectedType('generated')}
        >
          <Sparkles 
            size={32} 
            color={selectedType === 'generated' ? colors.primary : colors.text} 
          />
          <Text style={[
            styles.optionTitle,
            { color: selectedType === 'generated' ? colors.primary : colors.text }
          ]}>
            AI-Generated Scenario
          </Text>
          <Text style={[styles.optionDescription, { color: colors.textLight }]}>
            Create a unique adventure tailored to your preferences
          </Text>
        </TouchableOpacity>
      </View>

      {selectedType === 'preset' && (
        <View style={styles.scenariosContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Scenarios
          </Text>
          
          {presetScenarios.map((scenario) => (
            <Card 
              key={scenario.id}
              style={[
                styles.scenarioCard,
                { 
                  borderColor: selectedScenario === scenario.id ? colors.primary : colors.border,
                  borderWidth: selectedScenario === scenario.id ? 2 : 1,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.scenarioContent}
                onPress={() => setSelectedScenario(scenario.id)}
              >
                <Image 
                  source={{ uri: scenario.image }} 
                  style={styles.scenarioImage}
                />
                <View style={styles.scenarioInfo}>
                  <Text style={[styles.scenarioTitle, { color: colors.text }]}>
                    {scenario.title}
                  </Text>
                  <Text style={[styles.scenarioLevel, { color: colors.primary }]}>
                    Levels {scenario.level}
                  </Text>
                  <Text 
                    style={[styles.scenarioDescription, { color: colors.textLight }]}
                    numberOfLines={2}
                  >
                    {scenario.description}
                  </Text>
                </View>
                <ChevronRight size={24} color={colors.textLight} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}

      {selectedType === 'generated' && (
        <View style={styles.generatedContainer}>
          <Card style={styles.infoCard}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              AI-Generated Adventure
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight }]}>
              Our AI will create a unique scenario based on your preferences in the following steps. 
              You'll be able to customize the tone, themes, and complexity of your adventure.
            </Text>
          </Card>
        </View>
      )}

      <Button
        title="Continue to Character Creation"
        onPress={handleContinue}
        disabled={!selectedType}
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
    marginBottom: 32,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  optionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  scenariosContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  scenarioCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  scenarioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scenarioImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  scenarioInfo: {
    flex: 1,
    padding: 16,
  },
  scenarioTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  scenarioLevel: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  scenarioDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  generatedContainer: {
    marginBottom: 24,
  },
  infoCard: {
    padding: 24,
  },
  infoTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  infoText: {
    fontFamily: 'Exo-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  continueButton: {
    marginTop: 8,
  },
});