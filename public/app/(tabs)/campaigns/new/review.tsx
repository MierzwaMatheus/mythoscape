import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, Map, User, Clock, Palette } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

export default function ReviewScreen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();

  // Essas informações deveriam vir de um estado global ou contexto na aplicação real
  const campaignDetails = {
    name: 'A Máscara de Vinsomer',
    scenario: {
      name: 'Cenário Gerado pela IA',
      description: 'Um mundo de fantasia medieval com elementos de magia e mistério.'
    },
    character: {
      name: 'Elwin Stormwind',
      ancestry: 'Elfo',
      class: 'Mago',
      background: 'Acadêmico'
    },
    tone: {
      name: 'Mistério e Exploração',
      themes: ['Mistério', 'Descoberta', 'Aventura']
    },
    mode: {
      name: 'Aventura Solo',
      features: ['Narrativa pessoal', 'Ritmo personalizado']
    },
    duration: {
      name: 'Média Duração',
      sessions: '6-10 sessões'
    }
  };

  const handleStartCampaign = () => {
    setIsGenerating(true);
    
    // Aqui seria feita a integração com a API da IA para gerar a aventura
    // Simulando um tempo de geração
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/campaigns/[id]', { params: { id: '1' } });
    }, 3000);
  };

  const renderSection = (title: string, content: string, icon: React.ElementType, color: string) => {
    const Icon = icon;
    
    return (
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Icon size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.sectionContent, { color: colors.textLight }]}>
          {content}
        </Text>
      </Card>
    );
  };

  const renderTagList = (tags: string[]) => {
    return (
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View 
            key={index} 
            style={[styles.tag, { backgroundColor: colors.primaryLight }]}
          >
            <Text style={[styles.tagText, { color: colors.primary }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Revisar Campanha
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Verifique os detalhes da sua campanha antes de começar
        </Text>
      </View>

      <Card style={styles.campaignNameCard}>
        <Text style={[styles.campaignNameLabel, { color: colors.textLight }]}>
          Nome da Campanha
        </Text>
        <Text style={[styles.campaignName, { color: colors.text }]}>
          {campaignDetails.name}
        </Text>
      </Card>

      <View style={styles.sectionsContainer}>
        {renderSection(
          'Cenário',
          campaignDetails.scenario.description,
          Map,
          colors.primary
        )}
        
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
              <User size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personagem
            </Text>
          </View>
          <View style={styles.characterDetails}>
            <View style={styles.characterDetail}>
              <Text style={[styles.detailLabel, { color: colors.textLight }]}>Nome:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{campaignDetails.character.name}</Text>
            </View>
            <View style={styles.characterDetail}>
              <Text style={[styles.detailLabel, { color: colors.textLight }]}>Ancestralidade:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{campaignDetails.character.ancestry}</Text>
            </View>
            <View style={styles.characterDetail}>
              <Text style={[styles.detailLabel, { color: colors.textLight }]}>Classe:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{campaignDetails.character.class}</Text>
            </View>
            <View style={styles.characterDetail}>
              <Text style={[styles.detailLabel, { color: colors.textLight }]}>Background:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{campaignDetails.character.background}</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
              <Palette size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tom da Aventura
            </Text>
          </View>
          <Text style={[styles.sectionContent, { color: colors.textLight }]}>
            {campaignDetails.tone.name}
          </Text>
          {renderTagList(campaignDetails.tone.themes)}
        </Card>
        
        {renderSection(
          'Modo de Jogo',
          campaignDetails.mode.name,
          User,
          colors.tertiary
        )}
        
        {renderSection(
          'Duração',
          `${campaignDetails.duration.name} (${campaignDetails.duration.sessions})`,
          Clock,
          colors.info
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Voltar e Editar"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
        />
        <Button
          title={isGenerating ? "Gerando Campanha..." : "Iniciar Campanha"}
          onPress={handleStartCampaign}
          disabled={isGenerating}
          style={styles.startButton}
          icon={isGenerating ? () => <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
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
  campaignNameCard: {
    marginBottom: 24,
    padding: 16,
  },
  campaignNameLabel: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  campaignName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 24,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: 'Bitter-SemiBold',
    fontSize: 18,
  },
  sectionContent: {
    fontFamily: 'Exo-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Exo-Medium',
    fontSize: 12,
  },
  characterDetails: {
    marginBottom: 12,
  },
  characterDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    width: 120,
  },
  detailValue: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  startButton: {
    flex: 2,
  },
}); 