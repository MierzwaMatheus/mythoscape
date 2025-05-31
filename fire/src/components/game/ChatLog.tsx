
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  sender: 'player' | 'gm';
  timestamp: Date;
}

// Placeholder messages
const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Bem-vindo à campanha! Você se encontra na taverna "O Javali Dourado" na pequena vila de Pedravale. O ambiente está movimentado com aventureiros locais.',
    sender: 'gm',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    content: 'Olho ao redor da taverna procurando por informações sobre as ruínas próximas. Vou até o balcão e peço uma bebida.',
    sender: 'player',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    content: 'O taverneiro, um halfling robusto chamado Bilbo, sorri ao vê-lo se aproximar. "Ah, mais um aventureiro interessado nas Ruínas de Pedra Negra, eh? Cuidado, jovem. Muitos entraram, poucos voltaram..."',
    sender: 'gm',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '4',
    content: 'Pergunto sobre os perigos específicos das ruínas e se ele conhece alguém que tenha retornado recentemente.',
    sender: 'player',
    timestamp: new Date(Date.now() - 120000)
  }
];

const ChatLog: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50"
    >
      {PLACEHOLDER_MESSAGES.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatLog;
