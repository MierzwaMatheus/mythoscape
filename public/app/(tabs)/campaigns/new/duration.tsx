import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Calendar, CalendarDays, CalendarRange } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface DurationOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  sessions: string;
  complexity: number;
}

export default function DurationScreen() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const cardsPerRow = isWeb ? 2 : 1;

  const durationOptions: DurationOption[] = [
    {
      id: 'oneshot',
      name: 'One-shot',
      description: 'Uma única aventura completa, perfeita para uma sessão de jogo.',
      icon: Clock,
      sessions: '1 sessão',
      complexity: 1
    },
    {
      id: 'short',
      name: 'Curta Duração',
      description: 'Uma aventura compacta que pode ser concluída em poucas sessões.',
      icon: Calendar,
      sessions: '3-5 sessões',
      complexity: 2
    },
    {
      id: 'medium',
      name: 'Média Duração',
      description: 'Uma campanha mais elaborada com desenvolvimento de personagem e enredo.',
      icon: CalendarDays,
      sessions: '6-10 sessões',
      complexity: 3
    },
    {
      id: 'long',
      name: 'Longa Duração',
      description: 'Uma campanha épica e complexa com múltiplos arcos narrativos.',
      icon: CalendarRange,
      sessions: '11+ sessões',
      complexity: 4
    }
  ];

  const handleContinue = () => {
    if (!selectedDuration) return;
    router.push('/campaigns/new/review');
  };

  const renderComplexityIndicator = (level: number) => {
    return (
      <View style={styles.complexityContainer}>
        {[1, 2, 3, 4].map((value) => (
          <View 
            key={value} 
            style={[
              styles.complexityDot, 
              { 
                backgroundColor: value <= level ? colors.primary : colors.border 
              }
            ]} 
          />
        ))}
      </View>
    );
  };

  const renderDurationCard = (duration: DurationOption) => {
    const Icon = duration.icon;
    const isSelected = selectedDuration === duration.id;

    return (
      <Card 
        key={duration.id}
        style={[
          styles.durationCard,
          { 
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
            backgroundColor: colors.cardBackground,
            width: isWeb ? `${100 / cardsPerRow - 2}%` : '100%'
          }
        ]}
      >
        <TouchableOpacity
          style={styles.durationContent}
          onPress={() => setSelectedDuration(duration.id)}
          id={`duration-${duration.id}`}
        >
          <View style={styles.durationHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <Icon size={24} color="#FFFFFF" />
            </View>
            
            <View style={styles.durationInfo}>
              <Text style={[styles.durationName, { color: colors.text }]}>
                {duration.name}
              </Text>
              <Text style={[styles.sessionsText, { color: colors.textLight }]}>
                {duration.sessions}
              </Text>
            </View>
          </View>
          
          <Text 
            style={[styles.durationDescription, { color: colors.text }]}
            numberOfLines={2}
          >
            {duration.description}
          </Text>
          
          <View style={styles.complexitySection}>
            <Text style={[styles.complexityLabel, { color: colors.textLight }]}>
              Complexidade:
            </Text>
            {renderComplexityIndicator(duration.complexity)}
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
          Escolha a Duração da Campanha
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Selecione quanto tempo você pretende dedicar a esta aventura
        </Text>
      </View>

      <View style={[styles.durationsContainer, isWeb && styles.durationsContainerWeb]}>
        {durationOptions.map(renderDurationCard)}
      </View>

      <Button
        title="Revisar Campanha"
        onPress={handleContinue}
        disabled={!selectedDuration}
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
  durationsContainer: {
    marginBottom: 24,
  },
  durationsContainerWeb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationCard: {
    marginBottom: 16,
  },
  durationContent: {
    width: '100%',
    padding: 16,
  },
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  durationInfo: {
    flex: 1,
  },
  durationName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
  },
  sessionsText: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
  },
  durationDescription: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  complexitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complexityLabel: {
    fontFamily: 'Exo-Medium',
    fontSize: 14,
    marginRight: 8,
  },
  complexityContainer: {
    flexDirection: 'row',
  },
  complexityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  continueButton: {
    marginTop: 8,
  },
}); 