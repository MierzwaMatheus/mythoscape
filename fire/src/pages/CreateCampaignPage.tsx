import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ref, push, set, update, get, ref as dbRef } from 'firebase/database';
import { database } from '@/lib/firebase';
import CampaignSetupAgent from '@/services/campaign-setup-agent';

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Nome e configurações iniciais' },
  { id: 2, title: 'Tom e Duração', description: 'Defina o estilo da campanha' },
  { id: 3, title: 'Cenário', description: 'Descreva o mundo da aventura' }
];

const GAME_MODE_OPTIONS = [
  { value: 'Solo', label: 'Solo' },
  { value: 'Grupo', label: 'Grupo' }
];

const TONE_OPTIONS = [
  { value: 'Sombrio', label: 'Sombrio' },
  { value: 'Heróico', label: 'Heróico' },
  { value: 'Épico', label: 'Épico' },
  { value: 'Clássico', label: 'Clássico' },
  { value: 'Humorístico', label: 'Humorístico' }
];

const DURATION_OPTIONS = [
  { value: 'Curta', label: 'Curta (1-3 sessões)' },
  { value: 'Média', label: 'Média (4-10 sessões)' },
  { value: 'Longa', label: 'Longa (10+ sessões)' }
];

const initialState = {
  campaignName: '',
  playerMode: '',
  tone: '',
  duration: '',
  settingSummary: '',
  system: 'Pathfinder 2e',
};

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelect(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, STEPS.length));
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      let apiKey = user.googleApiKey;
      if (!apiKey) {
        // Busca do RTDB caso não esteja no contexto do usuário
        const snap = await get(dbRef(database, `users/${user.uid}/googleApiKey`));
        apiKey = snap.exists() ? snap.val() : '';
        console.log('[DEBUG] API KEY buscada do RTDB:', apiKey);
      } else {
        console.log('[DEBUG] API KEY do contexto user:', apiKey);
      }
      if (!apiKey) throw new Error('Chave da Google API não encontrada');
      const setupInput = {
        ...form,
        userId: user.uid
      };
      console.log('[DEBUG] Chamando CampaignSetupAgent com:', setupInput);
      const result = await CampaignSetupAgent(setupInput, apiKey);
      console.log('[DEBUG] Campanha criada pelo agente:', result);
      navigate(`/campaign/${result.campaignId}`);
    } catch (err: any) {
      setError('Erro ao criar campanha');
      console.error('[ERRO] Falha ao criar campanha:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Criar Nova Campanha</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <Input
              label="Nome da Campanha"
              name="campaignName"
              value={form.campaignName}
              onChange={handleChange}
              required
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700">Modo de Jogo</Label>
              <RadioGroup
                value={form.playerMode}
                onValueChange={(value) => handleSelect('playerMode', value)}
              >
                {GAME_MODE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700">Tom da Campanha</Label>
              <Select value={form.tone} onValueChange={(value) => handleSelect('tone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom da campanha" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700">Duração Estimada</Label>
              <Select value={form.duration} onValueChange={(value) => handleSelect('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração estimada" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <Textarea
              label="Resumo do Cenário"
              name="settingSummary"
              value={form.settingSummary}
              onChange={handleChange}
              required
            />
            <Input
              label="Sistema"
              name="system"
              value={form.system}
              onChange={handleChange}
              required
              disabled
            />
          </>
        )}
        <div className="flex gap-2">
          {step > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Voltar
            </Button>
          )}
          {step < STEPS.length ? (
            <Button type="button" onClick={nextStep}>
              Próximo
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Campanha'}
            </Button>
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
}
