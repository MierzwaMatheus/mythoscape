export interface KnowledgeItem {
  id: string;
  name: string;
  type: 'location' | 'npc' | 'quest' | 'item';
  description?: string;
  isLocked?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  class?: string;
  color?: string;
}

export interface CampaignHeaderProps {
  campaignName: string;
  participants: Participant[];
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSettings?: () => void;
  onSummary?: () => void;
  onExit?: () => void;
}