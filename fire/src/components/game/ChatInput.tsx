import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import useMythoScapeAgents from '@/services/agents-architecture';
import { Button } from '../ui/button';

export default function ChatInput() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const [value, setValue] = useState('');
  const {
    processUserInput,
    loading,
    error
  } = useMythoScapeAgents(campaignId!, user?.uid!, user?.googleApiKey || '');

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    await processUserInput(value.trim());
    setValue('');
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2 p-2 border-t bg-white">
      <input
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Digite sua mensagem..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? 'Enviando...' : 'Enviar'}
      </Button>
      {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
    </form>
  );
}
