
import React from 'react';

const CharacterSheetTab: React.FC = () => {
  // Placeholder character data
  const character = {
    name: 'Thorin Forjacerta',
    classLevel: 'Guerreiro 3',
    hp: { current: 28, max: 32 },
    ac: 18,
    attributes: {
      STR: 16,
      DEX: 12,
      CON: 15,
      INT: 10,
      WIS: 13,
      CHA: 8
    },
    skills: ['Atletismo', 'Intimidação', 'Percepção']
  };

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const hpPercentage = (character.hp.current / character.hp.max) * 100;

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {/* Character Header */}
      <div className="text-center border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-semibold text-neutral-900">{character.name}</h2>
        <p className="text-sm text-neutral-600">{character.classLevel}</p>
      </div>

      {/* HP and AC */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-neutral-700">Pontos de Vida</span>
            <span className="text-sm text-neutral-600">
              {character.hp.current} / {character.hp.max}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-neutral-100 rounded">
          <span className="text-sm font-medium text-neutral-700">Classe de Armadura</span>
          <span className="text-lg font-semibold text-neutral-900">{character.ac}</span>
        </div>
      </div>

      {/* Attributes */}
      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-2">Atributos</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(character.attributes).map(([attr, score]) => (
            <div key={attr} className="text-center p-2 bg-neutral-100 rounded">
              <div className="text-xs font-medium text-neutral-600">{attr}</div>
              <div className="text-lg font-semibold text-neutral-900">{score}</div>
              <div className="text-xs text-neutral-500">
                {formatModifier(getModifier(score))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-2">Perícias Principais</h3>
        <div className="space-y-1">
          {character.skills.map((skill, index) => (
            <div key={index} className="text-sm text-neutral-600 py-1 px-2 bg-neutral-100 rounded">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetTab;
