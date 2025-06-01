import React from 'react';
import { useParams } from 'react-router-dom';
import { useCampaignChat } from '@/hooks/useCampaignChat';

export default function ChatLog() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { messages, loading } = useCampaignChat(campaignId);

  if (loading) return <div className="p-4 text-neutral-400">Carregando chat...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="text-neutral-400">Nenhuma mensagem ainda.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`rounded p-2 text-sm mb-2 ${msg.userId === 'gm' ? 'bg-neutral-200 text-left' : 'bg-primary text-white text-right'}`}>
            <span className="font-bold mr-2">{msg.userId === 'gm' ? 'Mestre' : 'Você'}</span>
            {msg.htmlContent ? (
              <span dangerouslySetInnerHTML={{ __html: msg.htmlContent }} />
            ) : (
              <span>{msg.content}</span>
            )}
            <span className="ml-2 text-xs text-neutral-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))
      )}
    </div>
  );
}
