
import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'player' | 'gm';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isPlayer = message.sender === 'player';
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isPlayer ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isPlayer
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border border-neutral-200 text-neutral-900'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className={`mt-1 text-xs text-neutral-500 ${isPlayer ? 'text-right' : 'text-left'}`}>
          {isPlayer ? 'Você' : 'Mestre'} • {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
