import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Button } from '../components/ui/button';
import ChatLog from '../components/game/ChatLog';
import ChatInput from '../components/game/ChatInput';
import SidebarTabs from '../components/game/SidebarTabs';
import { X, Menu, Send } from 'lucide-react';

export default function GamePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    get(ref(database, `campaigns/${campaignId}/metadata`))
      .then((snap) => {
        if (snap.exists()) {
          setMeta(snap.val());
        } else {
          setError('Campanha não encontrada');
        }
      })
      .catch(() => setError('Erro ao buscar campanha'))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <div className="text-center py-8">Carregando campanha...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!meta) return null;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-4 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} size="sm">Voltar</Button>
          <Button 
            variant="outline" 
            onClick={() => setShowSidebar(!showSidebar)}
            size="sm"
            className="flex items-center gap-2"
          >
            {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {showSidebar ? 'Fechar' : 'Menu'}
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          size="sm"
          className="flex items-center gap-2"
        >
          {showRightSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          {showRightSidebar ? 'Fechar' : 'Aba'}
        </Button>
      </div>

      {/* Left Sidebar - Mobile Overlay / Desktop Fixed */}
      <div className={`
        fixed lg:static inset-0 z-40 bg-background
        transform transition-transform duration-200 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-80 w-full max-w-xs
        flex flex-col
        border-r border-neutral-200
      `}>
        <div className="p-4 overflow-y-auto">
          <div className="lg:block hidden">
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Voltar</Button>
          </div>
          <h1 className="text-2xl font-bold mb-2">{meta.campaignName}</h1>
          <div className="mb-2 text-neutral-600">Sistema: {meta.system}</div>
          <div className="mb-2 text-neutral-600">Tom: {meta.tone}</div>
          <div className="mb-2 text-neutral-600">Modo: {meta.playerMode}</div>
          <div className="mb-2 text-neutral-600">Duração: {meta.duration}</div>
          <div className="mb-4 text-neutral-700 whitespace-pre-line">{meta.settingSummary}</div>
          <div className="mb-2 text-neutral-500 text-sm">Participantes:</div>
          <ul className="mb-4 list-disc list-inside text-neutral-700">
            {meta.playerUserIds && Object.keys(meta.playerUserIds).map(uid => (
              <li key={uid}>{uid}</li>
            ))}
          </ul>
          <div className="mt-8 text-neutral-400 text-center">(Funcionalidades em construção...)</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Jogando: {campaignId}
          </h1>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-background border border-neutral-200 rounded-lg overflow-hidden">
          <ChatLog />
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="icon" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Mobile Overlay / Desktop Fixed */}
      <div className={`
        fixed lg:static right-0 top-0 bottom-0 z-40 bg-background
        transform transition-transform duration-200 ease-in-out
        ${showRightSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:w-80 w-full max-w-xs
        flex flex-col
        border-l border-neutral-200
      `}>
        <SidebarTabs />
      </div>

      {/* Overlay para fechar menus no mobile */}
      {(showSidebar || showRightSidebar) && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}
    </div>
  );
}
