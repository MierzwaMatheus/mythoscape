export { default as CampaignHeader } from './CampaignHeader';

// Componentes temporários que serão movidos para seus próprios arquivos
import { View, Text } from 'react-native';

interface SidebarProps {
  knowledgeItems: any[];
  onItemSelect: () => void;
}

export const Sidebar = ({ knowledgeItems, onItemSelect }: SidebarProps) => (
  <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#eee' }}>
    <Text style={{ padding: 16 }}>Sidebar (Conhecimentos)</Text>
  </View>
);

interface ChatInterfaceProps {
  messages: any[];
  onSendMessage: () => void;
  onCommand: () => void;
}

export const ChatInterface = ({ messages, onSendMessage, onCommand }: ChatInterfaceProps) => (
  <View style={{ flex: 1 }}>
    <Text style={{ padding: 16 }}>Chat Interface</Text>
    <Text style={{ padding: 16 }}>{messages?.length || 0} mensagens</Text>
  </View>
);

interface DetailsPanelProps {
  item: any;
  onClose: () => void;
}

export const DetailsPanel = ({ item, onClose }: DetailsPanelProps) => (
  <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#eee' }}>
    <Text style={{ padding: 16 }}>Painel de Detalhes</Text>
    {item && <Text style={{ padding: 16 }}>{item.name}</Text>}
  </View>
); 