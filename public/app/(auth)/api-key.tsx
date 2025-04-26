import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Key, ExternalLink, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function ApiKeyScreen() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { saveApiKey } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    
    try {
      if (!apiKey) {
        throw new Error('Please enter your Google LLM API key');
      }
      
      await saveApiKey(apiKey);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const openHelpUrl = () => {
    Linking.openURL('https://developers.generativeai.google/tutorials/setup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>Connect Your API Key</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Enter your Google LLM API key to power your adventures
          </Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          <View style={[styles.infoContainer, { backgroundColor: colors.infoLight }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              MYTHOSCAPE uses the Google LLM API to generate immersive RPG experiences. 
              Your API key is stored securely and is only used for your personal adventures.
            </Text>
            
            <TouchableOpacity 
              style={[styles.helpButton, { backgroundColor: colors.info }]}
              onPress={openHelpUrl}
            >
              <HelpCircle size={16} color="#FFFFFF" />
              <Text style={styles.helpButtonText}>How to get an API key</Text>
              <ExternalLink size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Google LLM API Key</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.cardBackground
              }]}
              placeholder="Enter your API key"
              placeholderTextColor={colors.textLight}
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
            />
          </View>

          <Button 
            title="Continue to MYTHOSCAPE" 
            onPress={handleContinue} 
            loading={loading}
            icon={<Key size={20} color="#FFFFFF" />}
            style={{ marginTop: 24 }}
          />
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={[styles.skipText, { color: colors.textLight }]}>
              Skip for now (You can add this later)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
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
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
  },
  helpButtonText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
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
  skipButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  skipText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
});