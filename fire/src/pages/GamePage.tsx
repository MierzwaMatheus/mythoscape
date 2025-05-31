
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatLog from '../components/game/ChatLog';
import ChatInput from '../components/game/ChatInput';
import SidebarTabs from '../components/game/SidebarTabs';

const GamePage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 pb-16 lg:pb-0">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Jogando: {campaignId}
          </h1>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-background border border-neutral-200 rounded-lg overflow-hidden">
          <ChatLog />
          <ChatInput />
        </div>
      </div>

      {/* Sidebar Tabs */}
      <div className="lg:w-80 w-full">
        <SidebarTabs />
      </div>
    </div>
  );
};

export default GamePage;
