
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

const MarkdownEditorTab: React.FC = () => {
  const [notes, setNotes] = useState(`# Anotações da Campanha

## Sessão 1 - Chegada em Pedravale
- Chegamos na taverna "O Javali Dourado"
- Falamos com Bilbo, o taverneiro halfling
- Soubemos sobre as Ruínas de Pedra Negra
- Muitos aventureiros entraram, poucos voltaram

## Informações Importantes
- **Vila:** Pedravale
- **Taverna:** O Javali Dourado
- **NPC:** Bilbo (taverneiro halfling)
- **Local de interesse:** Ruínas de Pedra Negra

## Próximos Passos
- [ ] Investigar mais sobre as ruínas
- [ ] Conseguir equipamentos
- [ ] Formar grupo (se necessário)
`);

  const handleSave = () => {
    console.log('Salvando notas:', notes);
    // Aqui seria implementada a lógica de salvamento
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-neutral-700">Suas Anotações</h3>
        <Button size="sm" onClick={handleSave} className="gap-1">
          <Save className="w-3 h-3" />
          Salvar
        </Button>
      </div>
      
      <div className="flex-1">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Digite suas anotações em Markdown..."
          className="h-full resize-none font-mono text-sm"
        />
      </div>
      
      <div className="mt-2 text-xs text-neutral-500">
        Suporte básico para Markdown: **negrito**, *itálico*, # títulos, - listas
      </div>
    </div>
  );
};

export default MarkdownEditorTab;
