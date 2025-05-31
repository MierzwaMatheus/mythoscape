
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Campaign {
  id: string;
  name: string;
  system: string;
  summary: string;
  role: 'GM' | 'Player';
}

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'A Queda dos Dragões',
    system: 'D&D 5e',
    summary: 'Uma aventura épica contra os dragões ancestrais que ameaçam o reino.',
    role: 'GM'
  },
  {
    id: '2',
    name: 'Cyberpunk 2077: Night City',
    system: 'Cyberpunk Red',
    summary: 'Sobreviva nas ruas perigosas de Night City neste futuro distópico.',
    role: 'Player'
  },
  {
    id: '3',
    name: 'Mistérios de Arkham',
    system: 'Call of Cthulhu',
    summary: 'Investigue mistérios sobrenaturais na cidade assombrada de Arkham.',
    role: 'Player'
  }
];

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-background rounded-lg shadow-md border border-neutral-200 p-4 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
          {campaign.name}
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            campaign.role === 'GM'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary/10 text-secondary'
          }`}
        >
          {campaign.role}
        </span>
      </div>
      
      <p className="text-sm text-neutral-600 mb-2">
        {campaign.system}
      </p>
      
      <p className="text-sm text-neutral-700 line-clamp-3">
        {campaign.summary}
      </p>
    </div>
  );
};

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <House className="w-12 h-12 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Nenhuma campanha encontrada
        </h3>
        <p className="text-neutral-600 mb-6">
          Você ainda não tem nenhuma campanha. Que tal criar uma nova aventura?
        </p>
        <Button onClick={() => navigate('/create-campaign')}>
          + Criar Nova Campanha
        </Button>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const campaigns = mockCampaigns; // In real app, this would come from a data source

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-4 sm:mb-0">
          Minhas Campanhas
        </h1>
        
        <Button onClick={() => navigate('/create-campaign')}>
          + Criar Nova Campanha
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
