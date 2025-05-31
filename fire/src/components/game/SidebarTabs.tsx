
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CharacterSheetTab from './CharacterSheetTab';
import MarkdownEditorTab from './MarkdownEditorTab';

const SidebarTabs: React.FC = () => {
  return (
    <div className="h-full bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
      <Tabs defaultValue="ficha" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-neutral-200">
          <TabsTrigger value="ficha" className="rounded-none">
            Ficha
          </TabsTrigger>
          <TabsTrigger value="notas" className="rounded-none">
            Notas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ficha" className="flex-1 m-0">
          <CharacterSheetTab />
        </TabsContent>
        
        <TabsContent value="notas" className="flex-1 m-0">
          <MarkdownEditorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidebarTabs;
