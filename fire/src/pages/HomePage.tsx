
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
          Bem-vindo ao{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MythoScape
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-2xl mx-auto">
          Sua plataforma definitiva para criar, gerenciar e jogar campanhas de RPG incríveis. 
          Transforme suas ideias em aventuras épicas.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Acessar Dashboard
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => navigate('/create-campaign')}>
            Criar Campanha
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Criação Intuitiva
            </h3>
            <p className="text-neutral-600">
              Interface simples e poderosa para criar campanhas memoráveis
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-secondary rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Colaboração Real
            </h3>
            <p className="text-neutral-600">
              Conecte-se com outros jogadores e mestres em tempo real
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Organização Total
            </h3>
            <p className="text-neutral-600">
              Mantenha todas suas campanhas e personagens organizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
