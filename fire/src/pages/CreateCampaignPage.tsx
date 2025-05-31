
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';

interface CampaignFormData {
  name: string;
  gameMode: string;
  tone: string;
  duration: string;
  scenarioSummary: string;
}

const INITIAL_FORM_DATA: CampaignFormData = {
  name: '',
  gameMode: '',
  tone: '',
  duration: '',
  scenarioSummary: ''
};

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Nome e configurações iniciais' },
  { id: 2, title: 'Tom e Duração', description: 'Defina o estilo da campanha' },
  { id: 3, title: 'Cenário', description: 'Descreva o mundo da aventura' }
];

const GAME_MODE_OPTIONS = [
  { value: 'solo', label: 'Solo' },
  { value: 'group', label: 'Grupo' }
];

const TONE_OPTIONS = [
  { value: 'serious', label: 'Sério' },
  { value: 'humorous', label: 'Humorístico' },
  { value: 'dark', label: 'Sombrio' },
  { value: 'epic', label: 'Épico' },
  { value: 'classic-adventure', label: 'Aventura Clássica' }
];

const DURATION_OPTIONS = [
  { value: 'short', label: 'Curta (1-3 sessões)' },
  { value: 'medium', label: 'Média (4-10 sessões)' },
  { value: 'long', label: 'Longa (10+ sessões)' }
];

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>(INITIAL_FORM_DATA);

  const updateFormData = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Dados da campanha:', formData);
    // Por enquanto, apenas logamos os dados
    // Aqui será implementada a chamada para o backend
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.gameMode !== '';
      case 2:
        return formData.tone !== '' && formData.duration !== '';
      case 3:
        return formData.scenarioSummary.trim() !== '';
      default:
        return false;
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Nome da Campanha"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Digite o nome da sua campanha"
            />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700">Sistema</Label>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
                <p className="text-sm text-neutral-600">Sistema: Pathfinder 2ª Edição</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-neutral-700">Modo de Jogo</Label>
              <RadioGroup 
                value={formData.gameMode} 
                onValueChange={(value) => updateFormData('gameMode', value)}
              >
                {GAME_MODE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-700">Tom da Campanha</Label>
              <Select value={formData.tone} onValueChange={(value) => updateFormData('tone', value)}>
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
              <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Textarea
              label="Resumo do Cenário"
              value={formData.scenarioSummary}
              onChange={(e) => updateFormData('scenarioSummary', e.target.value)}
              placeholder="Ex: Uma pequena vila à beira de uma floresta antiga com ruínas misteriosas..."
              rows={6}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Criar Nova Campanha
        </h1>
        <p className="text-neutral-600">
          Siga os passos abaixo para configurar sua nova campanha
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep > step.id 
                  ? 'bg-primary text-white' 
                  : currentStep === step.id 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-200 text-neutral-500'
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-full h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-neutral-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <Progress value={progressPercentage} className="mb-2" />
        
        <div className="text-center">
          <h2 className="text-lg font-medium text-neutral-900">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-sm text-neutral-600">
            {STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-background border border-neutral-200 rounded-lg p-6 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep === STEPS.length ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
          >
            Criar Campanha
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateCampaignPage;
