import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { KnowledgeItem } from './types';
import { X, Info, BarChart2, Image as ImageIcon } from 'lucide-react-native';

interface DetailsPanelProps {
  item: KnowledgeItem | null;
  onClose?: () => void;
  isLoading?: boolean;
}

type TabType = 'description' | 'stats' | 'images';

const getItemIcon = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'location': return '🗺️';
    case 'npc': return '👤';
    case 'quest': return '📜';
    case 'item': return '💎';
    default: return '❓';
  }
};

const getItemLabel = (type: KnowledgeItem['type']) => {
  switch (type) {
    case 'location': return 'Local';
    case 'npc': return 'Personagem';
    case 'quest': return 'Missão';
    case 'item': return 'Item';
    default: return 'Desconhecido';
  }
};

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ item, onClose, isLoading = false }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('description');

  // Função para renderizar as abas
  const renderTabs = () => (
    <View style={styles.tabButtons}>
      <Pressable
        style={[
          styles.tabButton,
          activeTab === 'description' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
        ]}
        onPress={() => setActiveTab('description')}
      >
        <Info size={16} color={activeTab === 'description' ? colors.primary : colors.text} style={styles.tabIcon} />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'description' ? colors.primary : colors.text }
          ]}
        >
          Descrição
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.tabButton,
          activeTab === 'stats' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
        ]}
        onPress={() => setActiveTab('stats')}
      >
        <BarChart2 size={16} color={activeTab === 'stats' ? colors.primary : colors.text} style={styles.tabIcon} />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'stats' ? colors.primary : colors.text }
          ]}
        >
          Estatísticas
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.tabButton,
          activeTab === 'images' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
        ]}
        onPress={() => setActiveTab('images')}
      >
        <ImageIcon size={16} color={activeTab === 'images' ? colors.primary : colors.text} style={styles.tabIcon} />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'images' ? colors.primary : colors.text }
          ]}
        >
          Imagens
        </Text>
      </Pressable>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.skeletonHeader}>
          <View style={[styles.skeletonIcon, { backgroundColor: colors.border }]} />
          <View style={styles.skeletonTitleContainer}>
            <View style={[styles.skeletonType, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
          </View>
        </View>
        <View style={styles.tabContainer}>
          {renderTabs()}
        </View>
        <View style={[styles.skeletonContent, { backgroundColor: colors.border }]} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Selecione um item para ver seus detalhes
        </Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <ScrollView style={styles.tabContent}>
            {item.description ? (
              <Text style={[styles.description, { color: colors.text }]}>
                {item.description}
              </Text>
            ) : (
              <Text style={[styles.emptyDescription, { color: colors.text }]}>
                Nenhuma descrição disponível
              </Text>
            )}
          </ScrollView>
        );
      case 'stats':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Raridade:</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>Comum</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Descoberto em:</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>Sessão 2</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Relacionado a:</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>Mercador Thom</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.text }]}>Importância:</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3].map(star => (
                    <Text key={star} style={{ fontSize: 16, color: colors.primary }}>★</Text>
                  ))}
                  {[4, 5].map(star => (
                    <Text key={star} style={{ fontSize: 16, color: colors.border }}>★</Text>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case 'images':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.imagesPlaceholder}>
              <ImageIcon size={48} color={colors.border} />
              <Text style={[styles.placeholderText, { color: colors.text }]}>
                Nenhuma imagem disponível
              </Text>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{getItemIcon(item.type)}</Text>
          <View>
            <Text style={[styles.type, { color: colors.text }]}>
              {getItemLabel(item.type)}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.name}
            </Text>
          </View>
        </View>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={20} color={colors.text} />
          </Pressable>
        )}
      </View>
      
      <View style={styles.tabContainer}>
        {renderTabs()}
      </View>
      
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  type: {
    fontFamily: 'Exo',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Bitter',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    marginLeft: 16,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: 'Exo',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  description: {
    fontFamily: 'Exo',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyText: {
    fontFamily: 'Exo',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyDescription: {
    fontFamily: 'Exo',
    fontSize: 16,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  statsContainer: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  statLabel: {
    fontFamily: 'Exo',
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontFamily: 'Exo',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  imagesPlaceholder: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 200,
  },
  placeholderText: {
    fontFamily: 'Exo',
    fontSize: 14,
    marginTop: 12,
    opacity: 0.7,
  },
  // Skeleton styles
  skeletonHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  skeletonTitleContainer: {
    flex: 1,
  },
  skeletonType: {
    height: 14,
    width: '30%',
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonTitle: {
    height: 24,
    width: '70%',
    borderRadius: 4,
  },
  skeletonContent: {
    flex: 1,
    marginTop: 16,
    borderRadius: 4,
    opacity: 0.3,
  },
});