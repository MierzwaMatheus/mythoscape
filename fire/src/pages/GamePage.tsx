import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Button } from '../components/ui/button';
import ChatLog from '../components/game/ChatLog';
import ChatInput from '../components/game/ChatInput';
import SidebarTabs from '../components/game/SidebarTabs';

export default function GamePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      <div className="max-w-2xl mx-auto py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Voltar</Button>
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
}
