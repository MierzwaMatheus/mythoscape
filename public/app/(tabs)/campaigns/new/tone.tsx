import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter, Link } from 'expo-router';
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
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const cardsPerRow = isWeb ? 2 : 1;

  const toneOptions: ToneOption[] = [
    {
      id: 'heroic',
      name: 'Aventura Heroica',
      description: 'Missões épicas e feitos nobres em um mundo que precisa de heróis.',
      icon: Sword,
      image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
      themes: ['Combate', 'Glória', 'Honra'],
    },
    {
      id: 'political',
      name: 'Intriga Política',
      description: 'Conspirações, alianças e lutas pelo poder em um mundo complexo.',
      icon: Crown,
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg',
      themes: ['Diplomacia', 'Enganação', 'Poder'],
    },
    {
      id: 'exploration',
      name: 'Exploração e Descoberta',
      description: 'Revele segredos antigos e explore territórios desconhecidos.',
      icon: Footprints,
      image: 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
      themes: ['Mistério', 'Aventura', 'Descoberta'],
    },
    {
      id: 'horror',
      name: 'Sombrio e Horror',
      description: 'Enfrente criaturas aterrorizantes e horrores sobrenaturais.',
      icon: Ghost,
      image: 'https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg',
      themes: ['Horror', 'Sobrevivência', 'Mistério'],
    },
    {
      id: 'grim',
      name: 'Realismo Brutal',
      description: 'Sobreviva em um mundo cruel onde cada escolha tem consequências.',
      icon: Skull,
      image: 'https://images.pexels.com/photos/6590699/pexels-photo-6590699.jpeg',
      themes: ['Sobrevivência', 'Moralidade', 'Conflito'],
    },
  ];

  const handleContinue = () => {
    if (!selectedTone) return;
    try {
      router.push({
        pathname: '/campaigns/new/mode',
      });
    } catch (error) {
      // Fallback se houver erro
    }
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
            width: isWeb ? `${100 / cardsPerRow - 2}%` : '100%'
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
          Escolha o Tom da Aventura
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Selecione o estilo e temas que moldarão a narrativa da sua campanha
        </Text>
      </View>

      <View style={[styles.tonesContainer, isWeb && styles.tonesContainerWeb]}>
        {toneOptions.map(renderToneCard)}
      </View>

      <Button
        title="Continuar para Modo de Jogo"
        onPress={handleContinue}
        disabled={!selectedTone}
        style={styles.continueButton}
        id="continue-to-mode-button"
      />
      
      {selectedTone && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Se o botão acima não funcionar, tente este link:
          </Text>
          <Link href="/campaigns/new/mode" style={{ padding: 12, marginTop: 8, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontFamily: 'Exo-Medium' }}>
              Ir para Modo de Jogo (Link alternativo)
            </Text>
          </Link>
        </View>
      )}
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
  tonesContainerWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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