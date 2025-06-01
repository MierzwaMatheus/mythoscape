import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Button } from '../ui/button';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface ApiKeyConfigProps {
  onApiKeySaved?: () => void;
}

export default function ApiKeyConfig({ onApiKeySaved }: ApiKeyConfigProps) {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    get(ref(database, `users/${user.uid}/googleApiKey`)).then(snap => {
      if (snap.exists()) setApiKey(snap.val());
    });
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      if (!apiKey.trim()) throw new Error('A chave API é obrigatória');
      await set(ref(database, `users/${user.uid}/googleApiKey`), apiKey.trim());
      setSuccess(true);
      onApiKeySaved?.();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar chave');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <label className="text-sm font-medium text-neutral-700">Chave da Google AI (Gemini) - Obrigatória</label>
      </div>
      
      <div className="bg-neutral-50 p-3 rounded-md mb-3 text-xs text-neutral-600">
        <p className="mb-2">Para obter sua chave API:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Acesse o <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink className="w-3 h-3" /></a></li>
          <li>Faça login com sua conta Google</li>
          <li>Clique em "Get API Key" no menu superior</li>
          <li>Copie a chave gerada e cole abaixo</li>
        </ol>
      </div>

      <div className="space-y-2">
        <input
          type="password"
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Cole sua chave API aqui..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          disabled={loading}
          required
        />
        <Button 
          type="button" 
          size="sm" 
          disabled={loading || !apiKey.trim()}
          onClick={handleSave}
        >
          Salvar Chave
        </Button>
        {success && <div className="text-green-600 text-xs mt-1">Chave salva com sucesso!</div>}
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    </div>
  );
} 