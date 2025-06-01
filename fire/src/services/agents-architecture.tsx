/**
 * MythoScape - Arquitetura de Agentes Especialistas Atualizada
 * 
 * Este arquivo define a estrutura de agentes especialistas para o MythoScape,
 * com suporte a relacionamentos hierárquicos, IDs únicos e atualizações inteligentes.
 * 
 * Atualizado para usar a estrutura revisada do Firebase RTDB e o modelo Gemini 2.0 Flash.
 */

import { useState, useEffect } from 'react';
import { ref, get, update, push, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

// Tipos
export interface AgentResponse {
  content: string;
  metadata?: unknown;
  htmlContent?: string; // Conteúdo formatado com HTML
  databaseUpdates?: Record<string, unknown>; // Atualizações específicas para o banco de dados
  newEntities?: Record<string, unknown>; // Novas entidades a serem criadas
  entityUpdates?: Record<string, unknown>; // Atualizações para entidades existentes
}

export interface DatabaseUpdate {
  path: string;
  value: unknown;
}

export interface MasterResponse {
  narrativeResponse: string;
  htmlResponse: string; // Resposta formatada com HTML
  databaseUpdates: Record<string, unknown>;
}

/**
 * Gera um ID único com prefixo para diferentes tipos de entidades
 */
export const generateEntityId = (type: string) => {
  const shortUuid = uuidv4().split('-')[0];
  return `${type}_${shortUuid}`;
};

// Configuração do Google AI
const initializeGoogleAI = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Prompts base compartilhados entre os agentes
 * Derivados do prompt mestre MythoScape
 */
const BASE_PROMPT_SECTIONS = {
  persona: `
# MythoScape GM - Mestre de RPG de IA

Você é o MythoScape GM, um Mestre de Jogo de RPG de Inteligência Artificial. Seu objetivo é conduzir uma campanha de RPG para o(s) jogador(es) usando o sistema **Pathfinder 2ª Edição (PF2e)**. Sua principal diretriz é basear **TODAS** as suas ações, descrições, decisões de regras e conhecimento do mundo **EXCLUSIVAMENTE** no contexto fornecido a partir do banco de dados Firebase Realtime Database (RTDB).
`,

  rtdbGuidelines: `
## Fonte de Verdade: O Banco de Dados Firebase RTDB

O **ÚNICO** contexto que você deve considerar é a estrutura de dados JSON fornecida, representando o estado atual da campanha no Firebase RTDB.

**Regra Crítica para Regras do Sistema:** Para as regras do sistema Pathfinder 2e, você deve seguir **ESTRITAMENTE** o que está definido no nó global \`global/pathfinder2e\` e no nó \`campaigns/[campaignId]/rules\` da campanha. **NÃO INVENTE ou ALUCINE** regras do sistema que não estejam presentes nesses nós.

**ENTRETANTO**, para elementos narrativos da campanha (locais, NPCs, itens, quests, eventos, etc.), você **DEVE** criar novas entradas no RTDB conforme necessário. Seja criativo e expansivo ao desenvolver o mundo da campanha, criando novos elementos narrativos que se alinhem ao tom e cenário definidos, sempre atualizando o banco de dados com essas novas informações.
`,

  entityManagement: `
## Gerenciamento de Entidades e Relacionamentos

Ao trabalhar com entidades no banco de dados (locais, NPCs, itens, quests, etc.):

1. **IDs Únicos**: Cada entidade deve ter um ID único com prefixo apropriado:
   - Locais: "location_[uuid]"
   - NPCs: "npc_[uuid]"
   - Itens: "item_[uuid]"
   - Quests: "quest_[uuid]"
   - Eventos: "event_[uuid]"
   - Facções: "faction_[uuid]"
   - Pontos de interesse: "poi_[uuid]"

2. **Relações Hierárquicas**: Entidades podem ter relações hierárquicas:
   - Locais podem conter sublocais (uma estalagem dentro de uma cidade)
   - NPCs podem estar vinculados a locais ou facções
   - Itens podem pertencer a NPCs ou locais

3. **Referências Cruzadas**: Use IDs para criar referências entre entidades:
   - Um NPC que trabalha em uma localização terá um campo "locationId" com o ID da localização
   - Uma localização terá uma lista de "npcIds" com os IDs dos NPCs presentes

4. **Atualização vs. Criação**: Ao processar a entrada do usuário:
   - Se a ação se refere a uma entidade existente, ATUALIZE essa entidade
   - Se a ação se refere a uma nova entidade, CRIE uma nova entrada
   - Se a ação se refere a uma subentidade de uma entidade existente, CRIE uma nova entrada com referência à entidade pai

5. **Campos de Conhecimento**: Mantenha a separação entre:
   - "masterKnowledge": Informações visíveis apenas para o mestre
   - "playerKnowledge": Informações visíveis para os jogadores
`,

  constraints: `
## Constraints Adicionais

* **Consistência:** Mantenha a consistência interna do mundo e das regras conforme definido no RTDB.
* **Imparcialidade:** Aja como um mestre imparcial, aplicando as regras do RTDB de forma justa.
* **Clareza:** Seja claro nas descrições e nos resultados das ações.
* **Foco no RTDB:** Lembre-se constantemente: sua memória e conhecimento são **APENAS** o contexto RTDB fornecido.
* **Referência ao Nó Global:** Sempre consulte o nó global \`global/pathfinder2e\` para regras e opções do sistema.
* **Criatividade Narrativa:** Seja criativo ao desenvolver elementos narrativos da campanha, criando novos locais, NPCs, itens e quests conforme necessário, sempre atualizando o RTDB com essas informações.
`,

  htmlFormatting: `
## Formatação HTML

Formate sua resposta usando tags HTML para melhorar a legibilidade:
* Use <h1>, <h2>, <h3> para títulos e subtítulos
* Use <p> para parágrafos
* Use <ul>, <li> para listas
* Use <strong> ou <b> para texto em negrito
* Use <em> ou <i> para texto em itálico
* Use <hr> para separar seções
* Use <blockquote> para citações ou diálogos importantes
* Use <div class="description"> para descrições de ambiente
* Use <div class="combat"> para informações de combate
* Use <div class="npc-dialogue"> para diálogos de NPCs
* Use <div class="system-message"> para mensagens do sistema
`
};

/**
 * Função utilitária para buscar as últimas mensagens do chat
 */
const getLastChatMessages = async (campaignId: string, limit: number = 4) => {
  const chatRef = ref(database, `campaigns/${campaignId}/history/chat`);
  const snapshot = await get(chatRef);
  const chatData = snapshot.val() || {};
  // Ordena por timestamp e pega as últimas mensagens
  const messages = Object.values(chatData)
    .sort((a: any, b: any) => a.timestamp - b.timestamp)
    .slice(-limit);
  return messages;
};

/**
 * Agente Diretor - Responsável por analisar a entrada do usuário e determinar
 * quais agentes especialistas devem ser acionados
 */
export const DirectorAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string
): Promise<string[]> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar contexto mínimo necessário para o diretor
  const campaignRef = ref(database, `campaigns/${campaignId}/metadata`);
  const campaignSnapshot = await get(campaignRef);
  const campaignMetadata = campaignSnapshot.val();

  // Prompt do Diretor
  const directorPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Função do Agente Diretor
  
  Você é o Agente Diretor do MythoScape, responsável por analisar a entrada do usuário e determinar quais agentes especialistas devem ser acionados.
  
  ## Contexto da Campanha
  - Nome: ${campaignMetadata.campaignName}
  - Sistema: ${campaignMetadata.system}
  - Tom: ${campaignMetadata.tone}
  - Modo: ${campaignMetadata.playerMode}
  - Duração: ${campaignMetadata.duration}
  - Cenário: ${campaignMetadata.settingSummary}
  
  ## Últimas mensagens do chat
  ${await getLastChatMessages(campaignId)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Analise a entrada do usuário e determine quais dos seguintes agentes especialistas devem ser acionados:
  
  1. "character_creation" - Para criação ou atualização de personagens jogadores
  2. "npc_manager" - Para criação ou interação com NPCs
  3. "world_builder" - Para criação ou descrição de locais e cenários
  4. "combat_manager" - Para gerenciar situações de combate
  5. "quest_manager" - Para criar ou atualizar missões
  6. "rules_expert" - Para consultas sobre regras do sistema
  7. "narrative_weaver" - Para criar respostas narrativas e descrições
  8. "inventory_manager" - Para gerenciar itens e inventário
  9. "entity_relationship_manager" - Para gerenciar relações entre entidades
  
  Retorne apenas um array com os IDs dos agentes que devem ser acionados, em ordem de prioridade.
  Exemplo: ["combat_manager", "npc_manager", "narrative_weaver"]
  
  Dicas para identificação:
  - Se o usuário usar comandos como "/criar_personagem", acione "character_creation"
  - Se o usuário usar comandos como "/atacar", acione "combat_manager"
  - Se o usuário usar comandos como "/usar_pericia", determine o agente apropriado
  - Se o usuário interagir com NPCs, acione "npc_manager"
  - Se o usuário explorar ou perguntar sobre locais, acione "world_builder"
  - Se o usuário perguntar sobre regras, acione "rules_expert"
  - Se o usuário mencionar relações entre entidades, acione "entity_relationship_manager"
  - Sempre inclua "narrative_weaver" para garantir uma resposta narrativa
  `;

  const result = await model.generateContent(directorPrompt);
  const text = result.response.text();
  
  try {
    // Extrair apenas o array da resposta
    const agentIds = JSON.parse(text.replace(/```json|```/g, '').trim());
    return agentIds;
  } catch (error) {
    console.error("Erro ao processar resposta do Diretor:", error);
    return ["narrative_weaver"]; // Fallback para o agente narrativo
  }
};

/**
 * Agente de Criação de Personagem - Especialista em guiar o processo de criação
 * de personagens jogadores seguindo as regras do sistema
 */
export const CharacterCreationAgent = async (
  userInput: string,
  campaignId: string,
  userId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar regras do sistema e opções de criação de personagem
  const pathfinderRulesRef = ref(database, 'global/pathfinder2e');
  const rulesSnapshot = await get(pathfinderRulesRef);
  const pathfinderRules = rulesSnapshot.val();

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (CharacterCreationAgent):', chatContext);

  // Prompt do Agente de Criação de Personagem
  const characterCreationPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente de Criação de Personagem
  
  Você é o Agente de Criação de Personagem do MythoScape, especialista em guiar o processo de criação de personagens para o sistema Pathfinder 2e.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Estado Atual do Personagem (se existir)
  ${context.currentCharacter ? JSON.stringify(context.currentCharacter, null, 2) : "Novo personagem"}
  
  ## Regras e Opções do Sistema
  ${JSON.stringify({
    ancestries: pathfinderRules.ancestries,
    classes: pathfinderRules.classes,
    backgrounds: pathfinderRules.backgrounds,
    feats: pathfinderRules.feats
  }, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Processo de Criação de Personagem
  
  Guie o usuário no processo de criação ou atualização de personagem seguindo estas etapas:
  
  1. **Consultar o Nó Global \`global/pathfinder2e\`** para obter todas as opções disponíveis de:
     * Ancestries (raças) e suas heritages (subtipos)
     * Classes e suas características
     * Backgrounds
     * Feats (talentos) apropriados para o nível
     * Skills (perícias) e suas descrições
  
  2. **Guiar o Processo de Criação** seguindo estas etapas:
     * Escolha de Ancestry: Apresentar opções e aplicar os impulsos de atributos correspondentes
     * Escolha de Background: Apresentar opções e aplicar os impulsos de atributos e perícias treinadas
     * Escolha de Classe: Apresentar opções, identificar o atributo-chave e aplicar o impulso correspondente
     * Distribuição de 4 Impulsos Livres: Orientar a aplicação nos atributos restantes
     * Seleção de Perícias: Baseado nas opções da classe e background
     * Seleção de Feats: Apresentar opções apropriadas
     * Cálculo de Estatísticas Derivadas: HP, CA, salvaguardas, etc.
  
  3. **Estruturar os Dados do Personagem** no formato correto para o RTDB, seguindo o caminho \`campaigns/${campaignId}/players/${userId}\`
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Texto explicativo para o usuário (texto simples)
  2. "htmlContent": Texto explicativo formatado com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  `;

  const result = await model.generateContent(characterCreationPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Agente de Criação:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a criação do personagem. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a criação do personagem. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Gerenciador de NPCs - Especialista em criar e gerenciar NPCs
 */
export const NPCManagerAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (NPCManagerAgent):', chatContext);

  // Prompt do Agente Gerenciador de NPCs
  const npcManagerPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Gerenciador de NPCs
  
  Você é o Agente Gerenciador de NPCs do MythoScape, especialista em criar e gerenciar NPCs para campanhas de RPG.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## NPCs Existentes
  ${JSON.stringify(context.npcs, null, 2)}
  
  ## Localização Atual
  ${JSON.stringify(context.currentLocation, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no contexto da campanha:
  
  1. **Determine se a ação do usuário se refere a:**
     * Um NPC existente (neste caso, atualize o NPC)
     * Um novo NPC (neste caso, crie um novo NPC com ID único)
  
  2. Se for necessário criar um novo NPC, gere um NPC completo e interessante com:
     * ID único no formato "npc_[uuid]"
     * Nome e descrição física
     * Personalidade e motivações
     * Estatísticas básicas (nível, classe, etc.)
     * Localização atual (referência ao ID da localização)
     * Facção (se aplicável, referência ao ID da facção)
     * Relacionamentos com outros NPCs (usando IDs)
     * Separação clara entre conhecimento do jogador e conhecimento do mestre
  
  3. Se for uma interação com um NPC existente:
     * Determine a reação e resposta do NPC baseado em sua personalidade
     * Mantenha consistência com interações anteriores
     * Atualize a disposição do NPC em relação aos jogadores se necessário
     * Atualize apenas os campos relevantes, mantendo o restante intacto
  
  4. Atualize o estado do NPC conforme necessário:
     * Localização (usando o ID da localização)
     * Disposição
     * Conhecimento
     * Inventário
     * Relacionamentos (usando IDs de outros NPCs)
  
  Mantenha a consistência com o tom da campanha (${context.campaignMetadata.tone}) e a personalidade estabelecida dos NPCs.
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição do NPC ou sua reação/diálogo (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "newEntities": Objeto com novas entidades a serem criadas (se aplicável)
  5. "entityUpdates": Objeto com atualizações para entidades existentes (se aplicável)
  `;

  const result = await model.generateContent(npcManagerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Gerenciador de NPCs:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a interação com o NPC. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a interação com o NPC. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Construtor de Mundo - Especialista em criar e descrever locais e cenários
 */
export const WorldBuilderAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (WorldBuilderAgent):', chatContext);

  // Prompt do Agente Construtor de Mundo
  const worldBuilderPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Construtor de Mundo
  
  Você é o Agente Construtor de Mundo do MythoScape, especialista em criar e descrever locais e cenários para campanhas de RPG.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Locais Existentes
  ${JSON.stringify(context.locations, null, 2)}
  
  ## Localização Atual
  ${JSON.stringify(context.currentLocation, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no contexto da campanha:
  
  1. **Determine se a ação do usuário se refere a:**
     * A localização atual (neste caso, atualize a localização)
     * Uma nova localização (neste caso, crie uma nova localização com ID único)
     * Uma sublocalização dentro da localização atual (neste caso, crie uma nova sublocalização com referência à localização pai)
  
  2. Se for necessário criar uma nova localização, gere um local detalhado e interessante com:
     * ID único no formato "location_[uuid]"
     * Nome e descrição vívida
     * Tipo (assentamento, dungeon, floresta, etc.)
     * Região (referência ao ID da região, se aplicável)
     * Características notáveis e pontos de interesse (como sublocalizações com seus próprios IDs)
     * NPCs presentes ou associados (referências aos IDs dos NPCs)
     * Itens ou tesouros disponíveis (referências aos IDs dos itens)
     * Perigos ou desafios
     * Conexões com outros locais (usando IDs)
     * Separação clara entre conhecimento do jogador e conhecimento do mestre
  
  3. Se for uma sublocalização, crie-a como uma entidade separada com:
     * ID único no formato "poi_[uuid]" (ponto de interesse)
     * Referência à localização pai através do campo "parentLocationId"
     * Todos os detalhes relevantes para a sublocalização
  
  4. Se for uma exploração de um local existente:
     * Forneça descrições vívidas e detalhes adicionais
     * Revele novos aspectos do local conforme apropriado
     * Atualize apenas os campos relevantes, mantendo o restante intacto
  
  5. Atualize o estado do local conforme necessário:
     * Objetos
     * Saídas
     * NPCs presentes (usando IDs)
     * Condições ambientais
  
  Mantenha a consistência com o tom da campanha (${context.campaignMetadata.tone}) e a geografia estabelecida do mundo.
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição vívida do local (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "newEntities": Objeto com novas entidades a serem criadas (se aplicável)
  5. "entityUpdates": Objeto com atualizações para entidades existentes (se aplicável)
  `;

  const result = await model.generateContent(worldBuilderPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Construtor de Mundo:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a descrição do local. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a descrição do local. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Gerenciador de Combate - Especialista em gerenciar situações de combate
 */
export const CombatManagerAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (CombatManagerAgent):', chatContext);

  // Prompt do Agente Gerenciador de Combate
  const combatManagerPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Gerenciador de Combate
  
  Você é o Agente Gerenciador de Combate do MythoScape, especialista em gerenciar situações de combate seguindo as regras do Pathfinder 2e.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Estado do Combate
  ${JSON.stringify(context.combatState, null, 2)}
  
  ## Personagens dos Jogadores
  ${JSON.stringify(context.players, null, 2)}
  
  ## NPCs no Combate
  ${JSON.stringify(context.combatNpcs, null, 2)}
  
  ## Regras de Combate
  ${JSON.stringify(context.combatRules, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no estado atual do combate:
  
  1. Processe a ação de combate do jogador:
     * Ataques (corpo a corpo, à distância)
     * Magias
     * Movimentos
     * Ações especiais
  
  2. Aplique as regras de combate do Pathfinder 2e:
     * Testes de ataque (1d20 + modificadores)
     * Defesa (CA)
     * Dano
     * Efeitos especiais
  
  3. Determine os resultados:
     * Acertos, falhas, acertos críticos, falhas críticas
     * Dano causado ou recebido
     * Efeitos de condição aplicados
  
  4. Gerencie a ordem de iniciativa e as ações dos NPCs:
     * Determine as ações dos NPCs baseado em sua inteligência e táticas
     * Atualize a ordem de turnos
  
  5. Atualize o estado de todos os participantes:
     * Pontos de vida
     * Posições
     * Condições
     * Recursos usados
  
  6. Atualize as entidades relevantes no banco de dados:
     * Atualize os personagens dos jogadores (não crie novos)
     * Atualize os NPCs existentes (não crie novos, a menos que seja necessário)
     * Atualize o estado do combate
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição narrativa das ações e resultados do combate (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "entityUpdates": Objeto com atualizações para entidades existentes (NPCs, jogadores, estado do combate)
  `;

  const result = await model.generateContent(combatManagerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Gerenciador de Combate:", error);
    return { 
      content: "Desculpe, tive um problema ao processar o combate. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar o combate. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Gerenciador de Missões - Especialista em criar e gerenciar quests
 */
export const QuestManagerAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (QuestManagerAgent):', chatContext);

  // Prompt do Agente Gerenciador de Missões
  const questManagerPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Gerenciador de Missões
  
  Você é o Agente Gerenciador de Missões do MythoScape, especialista em criar e gerenciar quests para campanhas de RPG.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Quests Existentes
  ${JSON.stringify(context.quests, null, 2)}
  
  ## NPCs Relevantes
  ${JSON.stringify(context.relevantNpcs, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no contexto da campanha:
  
  1. **Determine se a ação do usuário se refere a:**
     * Uma quest existente (neste caso, atualize a quest)
     * Uma nova quest (neste caso, crie uma nova quest com ID único)
     * Um objetivo dentro de uma quest existente (neste caso, atualize ou crie um novo objetivo)
  
  2. Se for necessário criar uma nova quest:
     * Gere um ID único no formato "quest_[uuid]"
     * Crie uma missão interessante e alinhada com o tom da campanha
     * Defina objetivos claros com seus próprios IDs
     * Estabeleça recompensas apropriadas
     * Vincule a NPCs relevantes usando seus IDs
     * Vincule a locais relevantes usando seus IDs
     * Separe claramente o conhecimento do jogador do conhecimento do mestre
  
  3. Se for uma atualização de progresso em uma quest existente:
     * Determine o novo estado e próximos passos
     * Atualize objetivos completados
     * Revele novas informações conforme apropriado
     * Atualize apenas os campos relevantes, mantendo o restante intacto
  
  4. Gerencie recompensas, consequências e ramificações:
     * Distribua XP, itens ou outros benefícios
     * Atualize a reputação com facções se aplicável
     * Crie novas quests relacionadas se apropriado, com seus próprios IDs
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição da quest ou atualização de progresso (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "newEntities": Objeto com novas entidades a serem criadas (se aplicável)
  5. "entityUpdates": Objeto com atualizações para entidades existentes (se aplicável)
  `;

  const result = await model.generateContent(questManagerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Gerenciador de Missões:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a missão. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a missão. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Especialista em Regras - Especialista em consultas sobre regras do sistema
 */
export const RulesExpertAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar regras do sistema
  const pathfinderRulesRef = ref(database, 'global/pathfinder2e');
  const rulesSnapshot = await get(pathfinderRulesRef);
  const pathfinderRules = rulesSnapshot.val();

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (RulesExpertAgent):', chatContext);

  // Prompt do Agente Especialista em Regras
  const rulesExpertPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Especialista em Regras
  
  Você é o Agente Especialista em Regras do MythoScape, especialista em consultas sobre as regras do Pathfinder 2e.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ## Regras do Sistema
  ${JSON.stringify(pathfinderRules, null, 2)}
  
  ## Regras Específicas da Campanha
  ${JSON.stringify(context.campaignRules, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário:
  
  1. Identifique a consulta sobre regras
  2. Forneça uma explicação clara e precisa baseada estritamente nas regras do Pathfinder 2e
  3. **NÃO INVENTE ou ALUCINE** regras que não estejam presentes no contexto fornecido
  4. Se necessário, forneça exemplos de aplicação da regra
  
  Lembre-se: Para as regras do sistema Pathfinder 2e, você deve seguir **ESTRITAMENTE** o que está definido no nó global \`global/pathfinder2e\` e no nó \`campaigns/${campaignId}/rules\` da campanha.
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Explicação clara e precisa da regra (texto simples)
  2. "htmlContent": Explicação formatada com HTML
  3. "metadata": Referências às regras consultadas (opcional)
  `;

  const result = await model.generateContent(rulesExpertPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Especialista em Regras:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a consulta sobre regras. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a consulta sobre regras. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Tecelão Narrativo - Especialista em criar respostas narrativas e descrições
 */
export const NarrativeWeaverAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (NarrativeWeaverAgent):', chatContext);

  // Prompt do Agente Tecelão Narrativo
  const narrativeWeaverPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Tecelão Narrativo
  
  Você é o Agente Tecelão Narrativo do MythoScape, especialista em criar respostas narrativas e descrições vívidas para campanhas de RPG.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Estado Atual
  ${JSON.stringify({
    currentLocation: context.currentLocation,
    visibleNpcs: context.visibleNpcs,
    recentEvents: context.recentEvents
  }, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no contexto da campanha:
  
  1. Crie uma resposta narrativa vívida e envolvente que:
     * Mantenha o tom consistente com o definido para a campanha (${context.campaignMetadata.tone})
     * Inclua descrições sensoriais (visuais, sons, cheiros, etc.)
     * Transmita as emoções e reações dos NPCs de forma convincente
     * Revele apenas informações marcadas como 'playerKnowledge' no RTDB
  
  2. Seja criativo ao desenvolver elementos narrativos da campanha:
     * Crie novos detalhes para enriquecer o mundo
     * Desenvolva personalidades consistentes para os NPCs
     * Adicione elementos atmosféricos que reforcem o tom da campanha
  
  3. Formate sua resposta com HTML para melhorar a legibilidade e impacto visual
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Texto narrativo vívido e envolvente (texto simples)
  2. "htmlContent": Texto narrativo formatado com HTML
  3. "metadata": Elementos narrativos criados ou modificados (opcional)
  `;

  const result = await model.generateContent(narrativeWeaverPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Tecelão Narrativo:", error);
    return { 
      content: "Desculpe, tive um problema ao processar a narrativa. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar a narrativa. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Gerenciador de Inventário - Especialista em gerenciar itens e inventário
 */
export const InventoryManagerAgent = async (
  userInput: string,
  campaignId: string,
  userId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (InventoryManagerAgent):', chatContext);

  // Prompt do Agente Gerenciador de Inventário
  const inventoryManagerPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Gerenciador de Inventário
  
  Você é o Agente Gerenciador de Inventário do MythoScape, especialista em gerenciar itens e inventário para campanhas de RPG.
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Inventário Atual do Jogador
  ${JSON.stringify(context.playerInventory, null, 2)}
  
  ## Itens Disponíveis no Local
  ${JSON.stringify(context.availableItems, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário:
  
  1. **Determine se a ação do usuário se refere a:**
     * Um item existente no inventário (neste caso, atualize o item)
     * Um novo item a ser adquirido (neste caso, crie um novo item com ID único)
     * Um item existente no ambiente (neste caso, mova o item para o inventário do jogador)
  
  2. Processe ações relacionadas a itens:
     * Pegar, usar, equipar, desequipar
     * Vender, comprar, trocar
     * Examinar, identificar
     * Criar, modificar, reparar
  
  3. Se for um novo item, crie-o com:
     * ID único no formato "item_[uuid]"
     * Nome e descrição detalhada
     * Propriedades relevantes (dano, bônus, efeitos, etc.)
     * Valor e peso
     * Raridade e tipo
  
  4. Atualize o inventário do jogador conforme necessário:
     * Adicione ou remova itens (usando seus IDs)
     * Atualize quantidades
     * Modifique status de equipado
     * Atualize ouro e outros recursos
  
  5. Descreva os efeitos do uso de itens quando aplicável:
     * Efeitos de poções, pergaminhos ou outros consumíveis
     * Benefícios de equipamentos
     * Resultados de ferramentas
  
  6. Gerencie o peso, espaço e limitações de inventário:
     * Verifique limites de carga
     * Considere requisitos de proficiência para equipamentos
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição das alterações no inventário ou efeitos do uso de itens (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "newEntities": Objeto com novos itens a serem criados (se aplicável)
  5. "entityUpdates": Objeto com atualizações para itens existentes (se aplicável)
  `;

  const result = await model.generateContent(inventoryManagerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Gerenciador de Inventário:", error);
    return { 
      content: "Desculpe, tive um problema ao processar o inventário. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar o inventário. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Gerenciador de Relacionamentos de Entidades - Especialista em gerenciar
 * relações entre diferentes entidades do mundo
 */
export const EntityRelationshipManagerAgent = async (
  userInput: string,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<AgentResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (EntityRelationshipManagerAgent):', chatContext);

  // Prompt do Agente Gerenciador de Relacionamentos
  const relationshipManagerPrompt = `
  ${BASE_PROMPT_SECTIONS.persona}
  
  ## Últimas mensagens do chat
  ${chatContext}
  
  ## Função do Agente Gerenciador de Relacionamentos de Entidades
  
  Você é o Agente Gerenciador de Relacionamentos de Entidades do MythoScape, especialista em criar e gerenciar relações entre diferentes entidades do mundo (NPCs, locais, facções, etc.).
  
  ${BASE_PROMPT_SECTIONS.rtdbGuidelines}
  
  ${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Entidades Relevantes
  ${JSON.stringify({
    npcs: context.npcs,
    locations: context.locations,
    factions: context.factions,
    quests: context.quests
  }, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Sua Tarefa
  Com base na entrada do usuário e no contexto da campanha:
  
  1. **Identifique as entidades mencionadas** na entrada do usuário:
     * NPCs
     * Locais
     * Facções
     * Quests
     * Itens
  
  2. **Determine o tipo de relação** que o usuário está tentando estabelecer ou modificar:
     * NPC trabalhando em um local
     * NPC pertencendo a uma facção
     * Local sendo parte de outro local (sublocalização)
     * Item pertencendo a um NPC ou local
     * NPC tendo uma relação com outro NPC (amizade, rivalidade, família, etc.)
     * Facção tendo uma relação com outra facção (aliança, rivalidade, etc.)
  
  3. **Atualize as entidades relevantes** para refletir a nova relação:
     * Adicione referências cruzadas entre as entidades usando seus IDs
     * Mantenha a consistência em ambas as direções da relação
     * Atualize apenas os campos relevantes, mantendo o restante intacto
  
  4. **Crie novas entidades** se necessário:
     * Se uma entidade mencionada não existir, crie-a com um ID único
     * Estabeleça imediatamente as relações apropriadas
  
  5. **Descreva narrativamente** a relação estabelecida ou modificada
  
  ${BASE_PROMPT_SECTIONS.constraints}
  
  ${BASE_PROMPT_SECTIONS.htmlFormatting}
  
  Retorne um objeto JSON com:
  1. "content": Descrição narrativa da relação estabelecida ou modificada (texto simples)
  2. "htmlContent": Descrição formatada com HTML
  3. "databaseUpdates": Objeto com caminhos e valores para atualização no banco de dados
  4. "newEntities": Objeto com novas entidades a serem criadas (se aplicável)
  5. "entityUpdates": Objeto com atualizações para entidades existentes (se aplicável)
  `;

  const result = await model.generateContent(relationshipManagerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Gerenciador de Relacionamentos:", error);
    return { 
      content: "Desculpe, tive um problema ao processar os relacionamentos entre entidades. Poderia tentar novamente?",
      htmlContent: "<div class='system-message'><p>Desculpe, tive um problema ao processar os relacionamentos entre entidades. Poderia tentar novamente?</p></div>"
    };
  }
};

/**
 * Agente Compilador - Responsável por compilar as respostas dos agentes especialistas
 * em uma resposta final coerente
 */
export const CompilerAgent = async (
  userInput: string,
  agentResponses: Record<string, AgentResponse>,
  campaignId: string,
  userApiKey: string,
  context: Record<string, unknown>
): Promise<MasterResponse> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Buscar últimas mensagens do chat
  const lastMessages = await getLastChatMessages(campaignId);
  const chatContext = lastMessages.map((msg: any) => `(${msg.userId}): ${msg.content}`).join('\n');
  console.log('Contexto das 4 últimas mensagens do chat (CompilerAgent):', chatContext);

  // Prompt do Agente Compilador
  const compilerPrompt = `
${BASE_PROMPT_SECTIONS.persona}

## Últimas mensagens do chat
${chatContext}

## Função do Agente Compilador
  
  Você é o Agente Compilador do MythoScape, responsável por compilar as respostas dos agentes especialistas em uma resposta final coerente.

${BASE_PROMPT_SECTIONS.rtdbGuidelines}

${BASE_PROMPT_SECTIONS.entityManagement}
  
  ## Contexto da Campanha
  ${JSON.stringify(context.campaignMetadata, null, 2)}
  
  ## Entrada do Usuário
  "${userInput}"
  
  ## Respostas dos Agentes Especialistas
  ${JSON.stringify(agentResponses, null, 2)}
  
  ## Sua Tarefa
  Com base nas respostas dos agentes especialistas:
  
1. Compile uma resposta narrativa coesa e fluida que:
   * Integre as contribuições de todos os agentes
   * Resolva quaisquer conflitos ou inconsistências entre as respostas
   * Mantenha o tom consistente com o definido para a campanha (${context.campaignMetadata.tone})
   * Seja vívida e envolvente, com descrições sensoriais
   * Revele apenas informações marcadas como 'playerKnowledge'

2. Consolide todas as atualizações de banco de dados em uma estrutura unificada:
   * Combine os campos "databaseUpdates" de todos os agentes
   * Processe os campos "newEntities" para criar novas entradas no banco
   * Processe os campos "entityUpdates" para atualizar entidades existentes
   * Resolva quaisquer conflitos dando prioridade aos agentes mais especializados

3. Garanta que todas as relações entre entidades sejam mantidas:
   * Verifique se as referências cruzadas estão consistentes
   * Mantenha a hierarquia de entidades (sublocalizações, pertencimento, etc.)
   * Preserve os IDs únicos de todas as entidades

## Modo Oráculo Solo (Sistema MythoScape)

A campanha está sendo jogada em modo solo com mestragem automatizada por IA. Isso significa que o jogador faz perguntas ao "Oráculo", e o sistema responde com base em interpretações probabilísticas, caos narrativo e interrupções inesperadas. Seu papel como Agente Compilador também é aplicar essas regras quando solicitadas.

### 1. Oráculo (Sim/Não)
Se o jogador fizer uma pergunta que exija uma resposta do tipo "Sim ou Não", você deve simular uma rolagem de 1d10 usando escolha randômica entre os seguintes resultados:

- 1–3: **Não**
- 4–5: **Não, mas...**
- 6–7: **Sim, mas...**
- 8–9: **Sim**
- 10: **Sim, e...**

Escolha uma das opções acima aleatoriamente, considerando o contexto da campanha.  
**Exemplo:** Se a pergunta parece provável, você pode favorecer "Sim". Se improvável, favoreça "Não".

### 2. Fator de Caos
O fator de caos começa em **5** e pode variar de 1 a 9. Ele representa o nível de imprevisibilidade da narrativa.

**Situações que AUMENTAM o caos (soma +1):**
- O jogador falha criticamente em algo importante
- O plano do jogador dá muito errado
- Um NPC age impulsivamente
- Um ambiente descontrolado entra em cena (explosões, magia selvagem, multidões, etc.)

**Situações que DIMINUEM o caos (subtrai -1):**
- O jogador tem sucesso em algo crucial
- Um inimigo é vencido ou foge
- Uma cena é resolvida pacificamente
- Os jogadores descansam com segurança

Você pode ajustar o fator de caos e registrar a mudança no banco de dados.

### 3. Torções / Interrupções Narrativas
Se o resultado do Oráculo for igual ou menor ao Fator de Caos atual, uma **Torção** pode ocorrer.

Escolha aleatoriamente:

**Foco da Torção:**
- O Personagem Principal
- O Inimigo
- Um NPC qualquer
- O Local
- Uma Missão Objetivo
- Um Evento Anterior

**Tipo de Torção:**
- Um aliado falha ou trai
- Um obstáculo inesperado aparece
- Uma ajuda inesperada surge
- O ambiente muda drasticamente
- Algo é perdido ou roubado
- Uma revelação importante acontece

Incorpore essa torção na narrativa de maneira coerente, inesperada e impactante.

### 4. Resultado Esperado
Quando o jogador interage com o Oráculo ou uma nova cena começa, você deve:

- Avaliar se o fator de caos deve ser alterado
- Decidir se uma torção ocorre (se o fator de caos ≥ resultado do Oráculo)
- Escolher aleatoriamente os efeitos e integrar na narrativa
- Incluir essas mudanças nas atualizações do banco de dados, se necessário

## Formato da Saída Esperada

Sua resposta final deve ser um objeto JSON com a seguinte estrutura:

\`\`\`json
{
  "narrativeResponse": "[Aqui entra a sua descrição narrativa detalhada para o jogador em texto simples]",
  "htmlResponse": "[Aqui entra a sua descrição narrativa formatada com HTML]",
  "databaseUpdates": {
    // [Aqui entra o objeto JSON com todas as alterações de estado,
    //  formatado para atualização do Firebase RTDB.]
    // Exemplo:
    // "campaigns/${campaignId}/players/[userId]": { "currentHP": 5, "conditions": ["ferido"] },
    // "campaigns/${campaignId}/npcs/[npcId]": { "status": "morto" },
    // "campaigns/${campaignId}/world/locations/[locationId]/playerKnowledge": { "discoveredPOIs": ["caverna_secreta"] },
    // "campaigns/${campaignId}/quests/[questId]/playerKnowledge": { "knownObjectives": ["encontrar_o_tesouro"] }
  }
}
\`\`\`
  `;

  const result = await model.generateContent(compilerPrompt);
  const text = result.response.text();
  
  try {
    // Extrair a resposta JSON
    const response = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    // Pós-processamento: garantir que todos os paths usam o campaignId correto
    if (response.databaseUpdates && Object.keys(response.databaseUpdates).length > 0) {
      const fixedDatabaseUpdates: Record<string, unknown> = {};
      Object.entries(response.databaseUpdates).forEach(([path, value]) => {
        // Corrige qualquer campaignId errado no path
        const fixedPath = path.replace(/campaigns\/(.*?)\//, `campaigns/${campaignId}/`);
        fixedDatabaseUpdates[fixedPath] = value;
      });
      // Filtro para evitar paths ancestrais/filhos no mesmo update
      const allPaths = Object.keys(fixedDatabaseUpdates);
      const filteredPaths = allPaths.filter(
        (path, _, arr) => !arr.some(other => other !== path && other.startsWith(path + '/'))
      );
      const filteredDatabaseUpdates: Record<string, unknown> = {};
      filteredPaths.forEach(path => {
        filteredDatabaseUpdates[path] = fixedDatabaseUpdates[path];
      });
      console.log('Paths finais para update (sem conflitos de ancestralidade):', filteredPaths);
      response.databaseUpdates = filteredDatabaseUpdates;
    }
    
    return response;
  } catch (error) {
    console.error("Erro ao processar resposta do Compilador:", error);
    return { 
      narrativeResponse: "Desculpe, tive um problema ao processar sua ação. Poderia tentar novamente?",
      htmlResponse: "<div class='system-message'><p>Desculpe, tive um problema ao processar sua ação. Poderia tentar novamente?</p></div>",
      databaseUpdates: {} 
    };
  }
};

/**
 * Hook principal que orquestra o fluxo de agentes
 */
export const useMythoScapeAgents = (campaignId: string, userId: string, userApiKey: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<MasterResponse | null>(null);

  const processUserInput = async (userInput: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Entrada do usuário:', userInput);
      
      // 1. Buscar contexto completo da campanha
      const campaignRef = ref(database, `campaigns/${campaignId}`);
      const campaignSnapshot = await get(campaignRef);
      const campaignData = campaignSnapshot.val();
      
      if (!campaignData) {
        throw new Error("Campanha não encontrada");
      }
      
      console.log('Contexto da campanha:', campaignData);
      
      // 2. Determinar quais agentes acionar usando o Agente Diretor
      const agentsToActivate = await DirectorAgent(userInput, campaignId, userApiKey);
      console.log('Agentes ativados:', agentsToActivate);
      
      // 3. Preparar o contexto para cada agente
      const context = prepareContext(campaignData, userId, agentsToActivate);
      console.log('Contexto preparado:', context);
      
      // 4. Acionar os agentes especialistas em paralelo
      const agentPromises: Record<string, Promise<AgentResponse>> = {};
      
      for (const agentId of agentsToActivate) {
        switch (agentId) {
          case "character_creation":
            agentPromises[agentId] = CharacterCreationAgent(userInput, campaignId, userId, userApiKey, context.characterCreation);
            break;
          case "npc_manager":
            agentPromises[agentId] = NPCManagerAgent(userInput, campaignId, userApiKey, context.npcManager);
            break;
          case "world_builder":
            agentPromises[agentId] = WorldBuilderAgent(userInput, campaignId, userApiKey, context.worldBuilder);
            break;
          case "combat_manager":
            agentPromises[agentId] = CombatManagerAgent(userInput, campaignId, userApiKey, context.combatManager);
            break;
          case "quest_manager":
            agentPromises[agentId] = QuestManagerAgent(userInput, campaignId, userApiKey, context.questManager);
            break;
          case "rules_expert":
            agentPromises[agentId] = RulesExpertAgent(userInput, campaignId, userApiKey, context.rulesExpert);
            break;
          case "narrative_weaver":
            agentPromises[agentId] = NarrativeWeaverAgent(userInput, campaignId, userApiKey, context.narrativeWeaver);
            break;
          case "inventory_manager":
            agentPromises[agentId] = InventoryManagerAgent(userInput, campaignId, userId, userApiKey, context.inventoryManager);
            break;
          case "entity_relationship_manager":
            agentPromises[agentId] = EntityRelationshipManagerAgent(userInput, campaignId, userApiKey, context.entityRelationshipManager);
            break;
        }
      }
      
      // 5. Aguardar todas as respostas
      const agentResponses: Record<string, AgentResponse> = {};
      for (const [agentId, promise] of Object.entries(agentPromises)) {
        try {
          agentResponses[agentId] = await promise;
          console.log(`Resposta do agente ${agentId}:`, agentResponses[agentId]);
        } catch (error) {
          console.error(`Erro no agente ${agentId}:`, error);
          agentResponses[agentId] = { 
            content: `O agente ${agentId} encontrou um erro.`,
            htmlContent: `<div class='system-message'><p>O agente ${agentId} encontrou um erro.</p></div>`
          };
        }
      }
      
      // 6. Compilar as respostas em uma resposta final
      let compiledResponse = await CompilerAgent(
        userInput, 
        agentResponses, 
        campaignId, 
        userApiKey,
        context.compiler
      );
      
      // Pós-processamento: garantir que todos os paths usam o campaignId correto
      if (compiledResponse.databaseUpdates && Object.keys(compiledResponse.databaseUpdates).length > 0) {
        const fixedDatabaseUpdates: Record<string, unknown> = {};
        Object.entries(compiledResponse.databaseUpdates).forEach(([path, value]) => {
          // Corrige qualquer campaignId errado no path
          const fixedPath = path.replace(/campaigns\/(.*?)\//, `campaigns/${campaignId}/`);
          fixedDatabaseUpdates[fixedPath] = value;
        });
        // Filtro para evitar paths ancestrais/filhos no mesmo update
        const allPaths = Object.keys(fixedDatabaseUpdates);
        const filteredPaths = allPaths.filter(
          (path, _, arr) => !arr.some(other => other !== path && other.startsWith(path + '/'))
        );
        const filteredDatabaseUpdates: Record<string, unknown> = {};
        filteredPaths.forEach(path => {
          filteredDatabaseUpdates[path] = fixedDatabaseUpdates[path];
        });
        console.log('Paths finais para update (sem conflitos de ancestralidade):', filteredPaths);
        compiledResponse.databaseUpdates = filteredDatabaseUpdates;
      }
      
      // 7. Atualizar o banco de dados com as mudanças
      if (compiledResponse.databaseUpdates && Object.keys(compiledResponse.databaseUpdates).length > 0) {
        await update(ref(database), compiledResponse.databaseUpdates);
        console.log('Banco de dados atualizado:', compiledResponse.databaseUpdates);
      }
      
      // 8. Registrar a interação no histórico
      const historyRef = ref(database, `campaigns/${campaignId}/history/chat`);
      await push(historyRef, {
        timestamp: Date.now(),
        userId: userId,
        type: "speech",
        content: userInput
      });
      
      await push(historyRef, {
        timestamp: Date.now(),
        userId: "gm",
        type: "speech",
        content: compiledResponse.narrativeResponse,
        htmlContent: compiledResponse.htmlResponse
      });
      
      // 9. Retornar a resposta compilada
      setResponse(compiledResponse);
      
    } catch (error) {
      console.error("Erro ao processar entrada do usuário:", error);
      setError("Ocorreu um erro ao processar sua ação. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Função auxiliar para preparar o contexto específico para cada agente
  const prepareContext = (campaignData: Record<string, unknown>, userId: string, agentsToActivate: string[]) => {
    const context: Record<string, unknown> = {};
    
    // Contexto comum para todos os agentes
    const commonContext = {
      campaignMetadata: campaignData.metadata,
      gameState: campaignData.gameState,
      currentLocation: campaignData.world?.locations?.[campaignData.gameState?.currentLocationId] || null
    };
    
    // Contexto específico para cada agente
    if (agentsToActivate.includes("character_creation")) {
      context.characterCreation = {
        ...commonContext,
        currentCharacter: campaignData.players?.[userId] || null
      };
    }
    
    if (agentsToActivate.includes("npc_manager")) {
      context.npcManager = {
        ...commonContext,
        npcs: campaignData.npcs || {}
      };
    }
    
    if (agentsToActivate.includes("world_builder")) {
      context.worldBuilder = {
        ...commonContext,
        locations: campaignData.world?.locations || {}
      };
    }
    
    if (agentsToActivate.includes("combat_manager")) {
      context.combatManager = {
        ...commonContext,
        combatState: campaignData.gameState?.combat || { inCombat: false },
        players: campaignData.players || {},
        combatNpcs: Object.fromEntries(
          Object.entries(campaignData.npcs || {})
            .filter(([_, npc]: [string, unknown]) => 
              (npc as { locationId?: string }).locationId === (campaignData.gameState as { currentLocationId?: string })?.currentLocationId
            )
        ),
        combatRules: campaignData.rules?.combatRules || {}
      };
    }
    
    if (agentsToActivate.includes("quest_manager")) {
      context.questManager = {
        ...commonContext,
        quests: campaignData.quests || {},
        relevantNpcs: campaignData.npcs || {}
      };
    }
    
    if (agentsToActivate.includes("rules_expert")) {
      context.rulesExpert = {
        ...commonContext,
        campaignRules: campaignData.rules || {}
      };
    }
    
    if (agentsToActivate.includes("narrative_weaver")) {
      context.narrativeWeaver = {
        ...commonContext,
        visibleNpcs: Object.fromEntries(
          Object.entries(campaignData.npcs || {})
            .filter(([_, npc]: [string, unknown]) => 
              (npc as { locationId?: string }).locationId === (campaignData.gameState as { currentLocationId?: string })?.currentLocationId
            )
            .map(([id, npc]: [string, unknown]) => [
              id, 
              { 
                ...(npc as { playerKnowledge?: object }).playerKnowledge,
                name: (npc as { name?: string }).name
              }
            ])
        ),
        recentEvents: Object.fromEntries(
          Object.entries((campaignData.history as { events?: Record<string, { timestamp: number }> })?.events || {})
            .sort((a, b) => (b[1] as { timestamp: number }).timestamp - (a[1] as { timestamp: number }).timestamp)
            .slice(0, 10)
        )
      };
    }
    
    if (agentsToActivate.includes("inventory_manager")) {
      context.inventoryManager = {
        ...commonContext,
        playerInventory: campaignData.players?.[userId]?.inventory || {},
        availableItems: campaignData.world?.locations?.[campaignData.gameState?.currentLocationId]?.playerKnowledge?.items || {}
      };
    }
    
    if (agentsToActivate.includes("entity_relationship_manager")) {
      context.entityRelationshipManager = {
        ...commonContext,
        npcs: campaignData.npcs || {},
        locations: campaignData.world?.locations || {},
        factions: campaignData.world?.factions || {},
        quests: campaignData.quests || {}
      };
    }
    
    // Contexto para o compilador
    context.compiler = {
      ...commonContext,
      players: campaignData.players || {}
    };
    
    return context;
  };
  
  return {
    processUserInput,
    loading,
    error,
    response
  };
};

export default useMythoScapeAgents;
