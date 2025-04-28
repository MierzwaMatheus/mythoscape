import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown, ChevronUp, MapPin, Users, Scroll, Briefcase, Check, Lock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Tooltip from '@/components/common/Tooltip';

// Tipo para os itens de conhecimento
interface KnowledgeItem {
  id: string;
  name: string;
  type: 'location' | 'npc' | 'quest' | 'item';
  locked: boolean;
  description?: string;
}

interface SidebarProps {
  knowledgeItems: KnowledgeItem[];
  onItemSelect: (item: KnowledgeItem) => void;
  selectedItemId?: string;
}

export default function Sidebar({ knowledgeItems = [], onItemSelect, selectedItemId }: SidebarProps) {
  const { colors } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    locations: true,
    npcs: true,
    quests: true,
    items: true
  });

  // Filtrar itens por tipo
  const locations = knowledgeItems.filter(item => item.type === 'location');
  const npcs = knowledgeItems.filter(item => item.type === 'npc');
  const quests = knowledgeItems.filter(item => item.type === 'quest');
  const items = knowledgeItems.filter(item => item.type === 'item');

  // Função para alternar a expansão de uma seção
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Renderizar um item de conhecimento
  const renderKnowledgeItem = (item: KnowledgeItem) => {
    const isSelected = item.id === selectedItemId;

    return (
      <Tooltip 
        key={item.id} 
        content={item.description || (item.locked ? 'Bloqueado' : item.name)}
        position="right"
      >
        <TouchableOpacity
          style={[
            styles.knowledgeItem,
            isSelected && { backgroundColor: colors.primary + '15' },
            { borderLeftColor: isSelected ? colors.primary : 'transparent' }
          ]}
          onPress={() => onItemSelect(item)}
          disabled={item.locked}
          id={`knowledge-item-${item.id}`}
        >
          <Text 
            style={[
              styles.itemName, 
              { 
                color: item.locked ? colors.textLight : colors.text,
                opacity: item.locked ? 0.6 : 1
              }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          {item.locked ? (
            <Lock size={14} color={colors.textLight} style={styles.itemIcon} />
          ) : (
            <Check size={14} color={colors.success} style={styles.itemIcon} />
          )}
        </TouchableOpacity>
      </Tooltip>
    );
  };

  const renderSection = (
    title: string,
    items: KnowledgeItem[],
    icon: JSX.Element,
    sectionKey: keyof typeof expandedSections
  ) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={[
          styles.sectionHeader,
          { backgroundColor: colors.cardBackground }
        ]} 
        onPress={() => toggleSection(sectionKey)}
        id={`${sectionKey}-section`}
      >
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.itemCount, { color: colors.textLight }]}>
            {items.length}
          </Text>
        </View>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={16} color={colors.text} />
        ) : (
          <ChevronDown size={16} color={colors.text} />
        )}
      </TouchableOpacity>
      
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>
          {items.length > 0 ? (
            items.map(renderKnowledgeItem)
          ) : (
            <Text style={[styles.emptyMessage, { color: colors.textLight }]}>
              Nenhum item descoberto
            </Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderSection(
          'Locais',
          locations,
          <MapPin size={16} color={colors.primary} />,
          'locations'
        )}
        {renderSection(
          'NPCs',
          npcs,
          <Users size={16} color={colors.primary} />,
          'npcs'
        )}
        {renderSection(
          'Quests',
          quests,
          <Scroll size={16} color={colors.primary} />,
          'quests'
        )}
        {renderSection(
          'Itens',
          items,
          <Briefcase size={16} color={colors.primary} />,
          'items'
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Bitter-SemiBold',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  itemCount: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    marginLeft: 8,
  },
  sectionContent: {
    paddingVertical: 4,
  },
  knowledgeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderLeftWidth: 2,
    marginVertical: 1,
  },
  itemName: {
    fontFamily: 'Exo-Regular',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  itemIcon: {
    opacity: 0.8,
  },
  emptyMessage: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    fontStyle: 'italic',
    padding: 12,
    textAlign: 'center',
  }
}); 