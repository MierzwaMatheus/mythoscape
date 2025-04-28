import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, FileText, LogOut, Users, Clock, Play, Pause } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Tooltip from '@/components/common/Tooltip';
import { CampaignHeaderProps, Participant } from './types';

const HoverableButton = ({ onPress, onHoverIn, onHoverOut, style, children }) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    onPressIn={onHoverIn}
    onPressOut={onHoverOut}
  >
    {children}
  </TouchableOpacity>
);

export default function CampaignHeader({
  campaignName,
  participants,
  sessionNumber,
  totalSessions,
  playTime
}: CampaignHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleConfigPress = () => {
    Alert.alert(
      "Configurações da Campanha",
      "Insira sua chave API da Google:",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salvar", onPress: (apiKey) => console.log("API Key Saved:", apiKey) }
      ],
      { cancelable: true }
    );
  };

  const handleSummaryPress = () => {
    Alert.alert("Resumo da Sessão", "Funcionalidade em desenvolvimento");
  };

  const handleExitPress = () => {
    Alert.alert(
      "Sair da Campanha",
      "Tem certeza que deseja sair desta campanha?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: () => router.back(), style: "destructive" }
      ]
    );
  };

  const renderParticipantAvatar = (participant: Participant, index: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const avatarColor = colors[index % colors.length];
    
    return (
      <Tooltip key={participant.id} content={`${participant.name} - ${participant.class}`} position="bottom">
        <Pressable 
          style={[
            styles.avatar,
            { backgroundColor: avatarColor },
            index > 0 && styles.avatarOverlap
          ]}
        >
          <Text style={styles.avatarText}>
            {participant.name.charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </Tooltip>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={[styles.campaignName, { color: colors.text }]} id="campaign-title">
            {campaignName}
          </Text>
          
          <View style={styles.sessionInfo}>
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.textLight} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.textLight }]}>
                {playTime}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoText, { color: colors.textLight }]}>
                Sessão {sessionNumber}/{totalSessions}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.participantsContainer}>
            {participants.map(renderParticipantAvatar)}
            <Tooltip content="Participantes" position="bottom">
              <View style={[styles.participantCount, { backgroundColor: colors.primary }]}>
                <Users size={14} color="#FFF" />
                <Text style={styles.countText}>{participants.length}</Text>
              </View>
            </Tooltip>
          </View>

          <View style={styles.actionButtons}>
            <Tooltip content={isPlaying ? "Pausar Sessão" : "Retomar Sessão"} position="bottom">
              <HoverableButton
                style={[styles.actionButton, hoveredButton === 'play' && styles.buttonHovered]}
                onPress={handlePlayPause}
                onHoverIn={() => setHoveredButton('play')}
                onHoverOut={() => setHoveredButton(null)}
              >
                {isPlaying ? (
                  <Pause size={20} color={colors.text} />
                ) : (
                  <Play size={20} color={colors.text} />
                )}
              </HoverableButton>
            </Tooltip>

            <Tooltip content="Configurações" position="bottom">
              <HoverableButton
                style={[styles.actionButton, hoveredButton === 'config' && styles.buttonHovered]}
                onPress={handleConfigPress}
                onHoverIn={() => setHoveredButton('config')}
                onHoverOut={() => setHoveredButton(null)}
              >
                <Settings size={20} color={colors.text} />
              </HoverableButton>
            </Tooltip>

            <Tooltip content="Resumo da Sessão" position="bottom">
              <HoverableButton
                style={[styles.actionButton, hoveredButton === 'summary' && styles.buttonHovered]}
                onPress={handleSummaryPress}
                onHoverIn={() => setHoveredButton('summary')}
                onHoverOut={() => setHoveredButton(null)}
              >
                <FileText size={20} color={colors.text} />
              </HoverableButton>
            </Tooltip>

            <Tooltip content="Sair da Campanha" position="bottom">
              <HoverableButton
                style={[styles.actionButton, hoveredButton === 'exit' && styles.buttonHovered]}
                onPress={handleExitPress}
                onHoverIn={() => setHoveredButton('exit')}
                onHoverOut={() => setHoveredButton(null)}
              >
                <LogOut size={20} color={colors.text} />
              </HoverableButton>
            </Tooltip>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  campaignName: {
    fontFamily: 'Bitter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    opacity: 0.7,
  },
  infoText: {
    fontFamily: 'Exo-Medium',
    fontSize: 13,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'Exo-Bold',
    fontSize: 14,
  },
  participantCount: {
    height: 28,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 8,
    gap: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontFamily: 'Exo-Bold',
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonHovered: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
}); 