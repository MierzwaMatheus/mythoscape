# MythoScape

MythoScape é uma plataforma web de RPG que utiliza a LLM Gemini (Google) para mestrar campanhas de forma automatizada, com arquitetura de agentes especialistas e banco de dados em tempo real (Firebase).

## Objetivo

Permitir que jogadores participem de campanhas de RPG mestradas por IA, centralizando informações, comunicação e ferramentas em um só lugar, com robustez, rastreabilidade e automação narrativa.

## Funcionalidades Principais

- **Criação de Campanhas:** Fluxo multi-etapas, com setup inicial automatizado por IA (estrutura completa criada via agente).
- **Dashboard:** Visualização de todas as campanhas do usuário (como GM ou player), com acesso rápido e UX otimizada.
- **Área de Jogo:** Chat em tempo real, respostas narrativas da IA, logs detalhados, abas laterais para recursos e organização.
- **Arquitetura de Agentes:** Sistema modular de agentes especialistas para cada aspecto do RPG (NPCs, mundo, combate, inventário, etc).
- **Banco de Dados Estruturado:** Firebase RTDB com paths otimizados, updates atômicos e rastreáveis.
- **Logs e Depuração:** Logs coloridos e detalhados em todo o fluxo dos agentes, facilitando manutenção e troubleshooting.

## Arquitetura Técnica dos Agentes

### Fluxograma do Fluxo dos Agentes

```text
Usuário envia mensagem
        |
        v
[useMythoScapeAgents]
        |
        v
Busca contexto da campanha (RTDB)
        |
        v
[Agente Diretor] --- Decide quais agentes ativar
        |
        v
+-----------------------------+
|  Executa agentes em paralelo|
+-----------------------------+
        |
        v
[Agente Compilador] <--- Respostas dos agentes
        |
        v
Pós-processamento de paths/updates
        |
        v
Atualiza RTDB (update atômico)
        |
        v
Registra no histórico (chat)
        |
        v
Exibe resposta ao usuário
```

### Exemplo de Uso de Agente

```typescript
// Exemplo: Acionando o NPCManagerAgent
const resposta = await NPCManagerAgent(
	userInput, // entrada do usuário
	campaignId, // id da campanha
	userApiKey, // chave da API Gemini
	context // contexto extraído do RTDB
)

// Estrutura da resposta
// resposta: {
//   content: 'Texto simples',
//   htmlContent: '<div>Texto formatado</div>',
//   databaseUpdates: {
//     'campaigns/abc123/npcs/npc_xyz': { ...dadosAtualizados }
//   }
// }
```

### Exemplo de databaseUpdates

```json
{
	"campaigns/abc123/npcs/npc_xyz": {
		"name": "Mestre Aramil",
		"level": 5,
		"playerKnowledge": { "appearance": "Elfo de cabelos prateados" }
	},
	"campaigns/abc123/world/locations/city_001/playerKnowledge": {
		"discoveredPOIs": ["taverna", "mercado"]
	}
}
```

### Exemplo de Log Detalhado

```text
[LOG] Entrada do usuário: "Quero falar com o taverneiro."
[LOG] Agentes ativados: ["npc_manager", "narrative_weaver"]
[LOG] Contexto preparado: { ... }
[LOG] Contexto das 4 últimas mensagens do chat (NPCManagerAgent): (user): ... (gm): ...
[LOG] Resposta do agente npc_manager: { ... }
[LOG] Resposta compilada: { ... }
[LOG] Paths finais para update (sem conflitos de ancestralidade): [
  "campaigns/abc123/npcs/npc_xyz",
  "campaigns/abc123/world/locations/city_001/playerKnowledge"
]
```

## Estrutura do Banco de Dados (Firebase RTDB)

```
/campaigns/{campaignId}/
  metadata/
  world/
    locations/
    regions/
    factions/
  npcs/
  quests/
  players/{userId}/
  gameState/
  history/
    chat/
    events/
    journal/
  rules/
```

## Tecnologias Utilizadas

- **React + TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (estilização)
- **Radix UI** e **shadcn/ui** (componentes de interface)
- **React Router** (rotas)
- **React Query** (gerenciamento de dados)
- **Lucide** (ícones)
- **Firebase** (Realtime Database e Auth)
- **ESLint** (padrões de código)
- **PostCSS** e **TailwindCSS Animate** (animações)

## Como rodar o projeto

```bash
# Instale as dependências
npm install

# Rode o projeto em modo desenvolvimento
npm run dev

# Para build de produção
npm run build
```
