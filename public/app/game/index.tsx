import { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import CampaignHeader from '@/components/game/CampaignHeader';
import Sidebar from '@/components/game/Sidebar';
import ChatInterface from '@/components/game/ChatInterface';
import { DetailsPanel } from '@/components/game/DetailsPanel';
import { KnowledgeItem, Participant } from '@/components/game/types';
import { Menu, Search, Layers } from 'lucide-react-native';

export default function GameScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Estado para o item selecionado e loading
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Estados para o layout mobile
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Dados mock da campanha para teste
  const campaignData = {
    name: 'Guardiões de Zhar',
    participants: [
      { id: '1', name: 'Elric', class: 'Guerreiro', avatar: undefined },
      { id: '2', name: 'Lyra', class: 'Maga', avatar: undefined },
      { id: '3', name: 'Thorne', class: 'Ladino', avatar: undefined }
    ] as Participant[]
  };

  // Dados mock para a sidebar
  const knowledgeItems: KnowledgeItem[] = [
    { id: '1', name: 'Taverna do Dragão Dourado', type: 'location', isLocked: false, description: 'Uma taverna aconchegante no centro da cidade, conhecida por sua cerveja escura e histórias fantásticas contadas pelos viajantes. O proprietário, um anão chamado Durnik, mantém uma coleção de artefatos estranhos pendurados nas paredes.' },
    { id: '2', name: 'Floresta Sombria', type: 'location', isLocked: true },
    { id: '3', name: 'Mercador Thom', type: 'npc', isLocked: false, description: 'Um comerciante astuto e bem relacionado. Tem contatos em todas as grandes cidades e acesso a itens raros por um preço adequado. Sua lealdade está sempre com a moeda mais brilhante.' },
    { id: '4', name: 'Mistério da Cripta', type: 'quest', isLocked: false, description: 'Investigue os sons estranhos vindos da antiga cripta. Moradores relatam luzes e gemidos durante a noite, e o padre local teme que algo antigo tenha despertado.' },
    { id: '5', name: 'Amuleto de Proteção', type: 'item', isLocked: false, description: '+2 em testes de resistência contra magia. Este amuleto de prata tem inscrições élicas antigas e emite um leve brilho azulado quando magia hostil está próxima.' }
  ];

  const handleSendMessage = (message: string) => {
    console.log('Mensagem enviada:', message);
  };

  const handleCommand = (command: string) => {
    console.log('Comando executado:', command);
  };
  
  // Simular carregamento ao selecionar um item
  const handleSelectItem = (item: KnowledgeItem) => {
    setIsLoadingDetails(true);
    setSelectedItem(null);
    
    // Simular delay de carregamento
    setTimeout(() => {
      setSelectedItem(item);
      setIsLoadingDetails(false);
    }, 800);
  };
  
  // Atualizar showDetails quando um item é selecionado (apenas mobile)
  useEffect(() => {
    if (isMobile && selectedItem) {
      setShowDetails(true);
    }
  }, [selectedItem, isMobile]);
  
  // Função para fechar o painel de detalhes no mobile
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CampaignHeader 
        campaignName={campaignData.name}
        participants={campaignData.participants}
        isPlaying={true}
      />
      
      <View style={styles.content}>
        {isMobile ? (
          <View style={styles.mobileLayout}>
            {/* Botões de controle mobile */}
            <View style={styles.mobileControls}>
              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: colors.cardBackground }]} 
                onPress={() => setShowSidebar(true)}
              >
                <Search size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Área principal do chat */}
            <View style={styles.mobileChatContainer}>
              <ChatInterface
                messages={[]}
                onSendMessage={handleSendMessage}
                onCommand={handleCommand}
              />
            </View>
            
            {/* Modal da Sidebar */}
            <Modal
              visible={showSidebar}
              animationType="slide"
              transparent
              onRequestClose={() => setShowSidebar(false)}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity 
                      style={styles.closeModalButton}
                      onPress={() => setShowSidebar(false)}
                    >
                      <Menu size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalBody}>
                    <Sidebar 
                      knowledgeItems={knowledgeItems.map(item => ({
                        ...item,
                        locked: !!item.isLocked
                      }))}
                      onItemSelect={(item) => {
                        handleSelectItem(item);
                        setShowSidebar(false);
                      }}
                      selectedItemId={selectedItem?.id}
                    />
                  </View>
                </View>
              </View>
            </Modal>
            
            {/* Modal do DetailsPanel */}
            <Modal
              visible={showDetails}
              animationType="slide"
              transparent
              onRequestClose={handleCloseDetails}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                  <View style={styles.modalBody}>
                    <DetailsPanel 
                      item={selectedItem}
                      onClose={handleCloseDetails}
                      isLoading={isLoadingDetails}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <View style={styles.desktopLayout}>
            <View style={styles.sidebarContainer}>
              <Sidebar 
                knowledgeItems={knowledgeItems.map(item => ({
                  ...item,
                  locked: !!item.isLocked // Para compatibilidade com o Sidebar
                }))}
                onItemSelect={handleSelectItem}
                selectedItemId={selectedItem?.id}
              />
            </View>
            
            <View style={styles.chatContainer}>
              <ChatInterface
                messages={[]}
                onSendMessage={handleSendMessage}
                onCommand={handleCommand}
              />
            </View>
            
            <View style={styles.detailsContainer}>
              <DetailsPanel 
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                isLoading={isLoadingDetails}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  mobileLayout: {
    flex: 1,
    position: 'relative',
  },
  mobileControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileChatContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeModalButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: '20%',
    maxWidth: 300,
    minWidth: 200,
  },
  chatContainer: {
    flex: 1,
  },
  detailsContainer: {
    width: '30%',
    maxWidth: 400,
    minWidth: 250,
  }
});