import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Users, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface ModeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
  features: string[];
}

export default function ModeScreen() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const modeOptions: ModeOption[] = [
    {
      id: 'solo',
      name: 'Aventura Solo',
      description: 'Uma jornada individual com foco na narrativa pessoal do seu personagem.',
      icon: User,
      image: 'https://images.pexels.com/photos/6507483/pexels-photo-6507483.jpeg',
      features: ['Narrativa pessoal', 'Ritmo personalizado', 'Desenvolvimento de personagem']
    },
    {
      id: 'group',
      name: 'Aventura em Grupo',
      description: 'Uma campanha para múltiplos personagens com interações mais complexas e dinâmicas.',
      icon: Users,
      image: 'https://images.pexels.com/photos/5082567/pexels-photo-5082567.jpeg',
      features: ['Interação social', 'Combates táticos', 'Diversidade de papéis']
    }
  ];

  const handleContinue = () => {
    if (!selectedMode) return;
    router.push('/campaigns/new/duration');
  };

  const renderModeCard = (mode: ModeOption) => {
    const Icon = mode.icon;
    const isSelected = selectedMode === mode.id;

    return (
      <Card 
        key={mode.id}
        style={[
          styles.modeCard,
          { 
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
            width: isWeb ? `${100 / Math.min(modeOptions.length, 2) - 2}%` : '100%'
          }
        ]}
      >
        <TouchableOpacity
          style={styles.modeContent}
          onPress={() => setSelectedMode(mode.id)}
          id={`mode-${mode.id}`}
        >
          <Image 
            source={{ uri: mode.image }} 
            style={styles.modeImage}
          />
          
          <View style={styles.modeOverlay}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <Icon size={24} color="#FFFFFF" />
            </View>
            
            <View style={styles.modeInfo}>
              <Text style={[styles.modeName, { color: '#FFFFFF' }]}>
                {mode.name}
              </Text>
              <Text 
                style={[styles.modeDescription, { color: '#FFFFFF' }]}
                numberOfLines={2}
              >
                {mode.description}
              </Text>
            </View>
            
            <ChevronRight size={24} color="#FFFFFF" />
          </View>
          
          <View style={styles.featuresContainer}>
            {mode.features.map((feature, index) => (
              <View 
                key={index}
                style={[styles.featureTag, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.featureText, { color: colors.primary }]}>
                  {feature}
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
          Escolha o Modo de Jogo
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Selecione como você deseja jogar esta campanha
        </Text>
      </View>

      <View style={[styles.modesContainer, isWeb && styles.modesContainerWeb]}>
        {modeOptions.map(renderModeCard)}
      </View>

      <Button
        title="Continuar para Duração"
        onPress={handleContinue}
        disabled={!selectedMode}
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
  modesContainer: {
    marginBottom: 24,
  },
  modesContainerWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  modeContent: {
    width: '100%',
  },
  modeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modeOverlay: {
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
  modeInfo: {
    flex: 1,
    marginRight: 16,
  },
  modeName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  modeDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 12,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
  },
  continueButton: {
    marginTop: 8,
  },
}); 