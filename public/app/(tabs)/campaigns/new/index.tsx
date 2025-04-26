import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';

export default function NewCampaignScreen() {
  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const suggestedNames = [
    "Echoes of the Eternal Spire",
    "Whispers of the Crimson Crown",
    "Legacy of the Lost Kingdom",
    "Shadows of the Serpent's Eye"
  ];

  const handleContinue = () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }
    router.push('/campaigns/new/scenario');
  };

  const handleSuggestionPress = (name: string) => {
    setCampaignName(name);
    setError(null);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Name Your Campaign
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Choose a name that captures the essence of your adventure
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Campaign Name</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.cardBackground,
              borderColor: error ? colors.error : colors.border,
              color: colors.text,
            }
          ]}
          placeholder="Enter campaign name"
          placeholderTextColor={colors.textLight}
          value={campaignName}
          onChangeText={(text) => {
            setCampaignName(text);
            setError(null);
          }}
        />
        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
          Suggested Names
        </Text>
        <Text style={[styles.suggestionsSubtitle, { color: colors.textLight }]}>
          Click on any suggestion to use it
        </Text>
        
        {suggestedNames.map((name, index) => (
          <Button
            key={index}
            title={name}
            variant="outline"
            icon={<Sparkles size={18} color={colors.primary} />}
            onPress={() => handleSuggestionPress(name)}
            style={styles.suggestionButton}
          />
        ))}
      </View>

      <Button
        title="Continue to Scenario Selection"
        onPress={handleContinue}
        icon={<BookOpen size={20} color="#FFFFFF" />}
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
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Exo-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Exo-Regular',
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
  suggestionsTitle: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  suggestionsSubtitle: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  suggestionButton: {
    marginBottom: 12,
  },
  continueButton: {
    marginTop: 8,
  },
});