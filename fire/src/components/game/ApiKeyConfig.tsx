import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Button } from '../ui/button';

export default function ApiKeyConfig() {
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
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      await set(ref(database, `users/${user.uid}/googleApiKey`), apiKey.trim());
      setSuccess(true);
    } catch (err: any) {
      setError('Erro ao salvar chave');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="border-t pt-4 mt-4">
      <label className="block text-xs font-medium text-neutral-600 mb-1">Chave da Google AI (Gemini)</label>
      <input
        type="password"
        className="w-full border rounded px-2 py-1 text-xs mb-2"
        placeholder="Cole sua chave aqui..."
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" size="sm" disabled={loading || !apiKey.trim()}>
        Salvar Chave
      </Button>
      {success && <div className="text-green-600 text-xs mt-1">Chave salva!</div>}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </form>
  );
} 