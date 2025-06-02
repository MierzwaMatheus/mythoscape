# 🐉 MythoScape

<div align="center">
  <img src="https://i.postimg.cc/6QxwKxQf/favIF0.png" alt="MythoScape Banner" width="800"/>
  
  <p><em>Sua aventura épica, mestrada por Inteligência Artificial.</em></p>
  
  [![Licença MIT](https://img.shields.io/badge/Licença-MIT-blue.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)](https://reactjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
</div>

## 🌟 Visão Geral

**MythoScape** é uma plataforma web inovadora de RPG que utiliza a LLM Gemini (Google) para mestrar campanhas de forma automatizada. Com uma arquitetura de agentes especialistas e banco de dados em tempo real (Firebase), MythoScape centraliza informações, comunicação e ferramentas em um só lugar, permitindo que jogadores participem de narrativas imersivas com robustez, rastreabilidade e automação.

## ✨ Recursos Principais

-   **🎲 Criação de Campanhas Dinâmicas:** Fluxo multi-etapas com setup inicial automatizado por IA, gerando a estrutura completa da campanha através de um agente especializado.
-   **🖥️ Dashboard Intuitivo:** Visualize todas as suas campanhas (como Mestre ou Jogador) com acesso rápido e uma experiência de usuário otimizada.
-   **⚔️ Área de Jogo Imersiva:** Chat em tempo real com respostas narrativas da IA, logs detalhados de eventos e abas laterais para recursos, inventário e organização.
-   **🧠 Arquitetura de Agentes Especialistas:** Um sistema modular de agentes IA, cada um focado em um aspecto do RPG (NPCs, mundo, combate, missões, inventário, etc.), garantindo profundidade e coerência narrativa.
-   **🗄️ Banco de Dados Estruturado e Rastreável:** Utiliza Firebase Realtime Database com paths otimizados, permitindo updates atômicos e um histórico completo de alterações.
-   **🛠️ Logs Detalhados para Depuração:** Logs coloridos e informativos em todo o fluxo dos agentes, facilitando a manutenção, o troubleshooting e o entendimento do processo decisório da IA.

<details>
<summary><b>Clique para expandir e conhecer a Arquitetura dos Agentes</b></summary>

A espinha dorsal do MythoScape é seu sistema de agentes IA, que trabalham em conjunto para criar uma experiência de RPG coesa e reativa.

**Fluxograma do Fluxo dos Agentes:**

```text
Usuário envia mensagem
        |
        v
[useMythoScapeAgents] (Hook principal)
        |
        v
Busca contexto da campanha (RTDB)
        |
        v
[Agente Diretor] --- Decide quais agentes especialistas ativar
        |
        v
+--------------------------------------+
|  Executa agentes em paralelo (LLM)   |
+--------------------------------------+
        |
        v
[Agente Compilador] <--- Respostas dos agentes
        |
        v
Pós-processamento de paths/updates (resolução de conflitos)
        |
        v
Atualiza RTDB (update atômico e rastreável)
        |
        v
Registra no histórico da campanha (chat, eventos)
        |
        v
Exibe resposta narrativa ao usuário
```

**Exemplo de Uso de Agente (TypeScript):**

```typescript
// Exemplo: Acionando o NPCManagerAgent para interagir com um NPC
const resposta = await NPCManagerAgent(
	userInput, // "Quero perguntar ao taverneiro sobre rumores locais."
	campaignId, // ID da campanha ativa
	userApiKey, // Chave da API Gemini do usuário
	context // Contexto extraído do RTDB (estado atual do jogo, histórico, etc.)
);

// Estrutura esperada da resposta de um agente:
// resposta: {
//   content: 'Texto narrativo simples para o chat.',
//   htmlContent: '<div>Texto formatado com ênfase, listas, etc.</div>',
//   databaseUpdates: { // Objeto com os caminhos e dados a serem atualizados no Firebase
//     'campaigns/abc123/npcs/npc_taverneiro/dialogueState': { lastInteraction: "...", mood: "curioso" },
//     'campaigns/abc123/quests/rumor_001/status': "discovered"
//   }
// }
```

**Exemplo de `databaseUpdates` (JSON):**

```json
{
	"campaigns/abc123/npcs/npc_aramil": {
		"name": "Mestre Aramil",
		"level": 5,
		"playerKnowledge": { "appearance": "Elfo de cabelos prateados e olhos perspicazes" },
        "currentLocation": "locations/city_001/library"
	},
	"campaigns/abc123/world/locations/city_001/playerKnowledge": {
		"discoveredPOIs": ["taverna_dragao_sonolento", "mercado_central", "biblioteca_antiga"]
	},
    "campaigns/abc123/players/user_xyz/inventory/gold": 95
}
```

**Exemplo de Log Detalhado:**
```text
[LOG] Entrada do usuário: "Quero falar com o taverneiro."
[LOG] Hook useMythoScapeAgents iniciado.
[LOG] Contexto da campanha 'abc123' carregado do RTDB.
[LOG] Agente Diretor ativado.
[LOG] Agentes especialistas selecionados: ["NPCManagerAgent", "NarrativeWeaverAgent"]
[LOG] Contexto preparado para agentes: { worldState: {...}, playerInfo: {...}, lastMessages: [...] }
[LOG] Enviando requisição para NPCManagerAgent...
[LOG] Resposta do NPCManagerAgent: { content: "O taverneiro, um homem robusto chamado Borin, limpa um copo e olha para você. 'Pois não?'", databaseUpdates: {"campaigns/abc123/npcs/borin/interaction_count": 5} }
[LOG] Enviando requisição para NarrativeWeaverAgent...
[LOG] Resposta do NarrativeWeaverAgent: { content: "O ar na taverna está impregnado com o cheiro de cerveja e ensopado.", htmlContent: "<p>O ar na taverna está impregnado com o cheiro de <strong>cerveja</strong> e <em>ensopado</em>.</p>" }
[LOG] Agente Compilador processando respostas...
[LOG] Resposta compilada: { combinedContent: "O taverneiro, um homem robusto chamado Borin, limpa um copo e olha para você. 'Pois não?' O ar na taverna está impregnado com o cheiro de cerveja e ensopado." ...}
[LOG] Paths finais para update no RTDB (sem conflitos): ["campaigns/abc123/npcs/borin/interaction_count"]
[LOG] Atualizando RTDB...
[LOG] Resposta enviada ao chat do usuário.
```

</details>

### 🗺️ Fluxo de Jogo Simplificado

```mermaid
graph LR
    A[Criação/Seleção de Campanha] --> B[Dashboard do Jogador]
    B --> C[Área de Jogo]
    C -- Interação do Jogador (Chat) --> D[Processamento pelos Agentes IA]
    D -- Narrativa e Atualizações de Estado --> C
    C -- Fim da Sessão --> E[Salvamento Automático (RTDB)]
    
    style A fill:#8E44AD,color:#FFFFFF
    style B fill:#2980B9,color:#FFFFFF
    style C fill:#27AE60,color:#FFFFFF
    style D fill:#F39C12,color:#FFFFFF
    style E fill:#C0392B,color:#FFFFFF
```

### 💾 Estrutura do Banco de Dados (Firebase RTDB)

```
/campaigns/{campaignId}/
  metadata/             # Nome, descrição, sistema de regras, criador
  world/                # Informações sobre o universo da campanha
    locations/{locId}/  # Cidades, masmorras, pontos de interesse
    regions/{regionId}/ # Regiões geográficas
    factions/{factionId}/# Guildas, reinos, organizações
    lore/               # História do mundo, mitos, lendas
  npcs/{npcId}/         # Personagens não jogadores, com IA, stats, conhecimento
  quests/{questId}/     # Missões, objetivos, progresso
  players/{userId}/     # Fichas de personagem, inventário, estado
    characterSheet/
    inventory/
    journal/            # Diário do jogador, anotações pessoais
  gameState/            # Estado global do jogo (tempo, eventos ativos)
  history/              # Logs da campanha
    chat/               # Histórico de mensagens do chat
    events/             # Eventos significativos da campanha
    auditLog/           # Log de atualizações do banco de dados pelos agentes
  rules/                # Regras específicas da campanha (geradas ou customizadas)
  assets/               # Links para imagens, mapas (se aplicável)
```

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** React (com TypeScript), Vite
-   **Estilização:** TailwindCSS
-   **Componentes UI:** Radix UI, shadcn/ui
-   **Roteamento:** React Router
-   **Gerenciamento de Estado (Client):** React Query
-   **Ícones:** Lucide Icons
-   **Backend & Database:** Firebase (Realtime Database, Authentication)
-   **IA:** Google Generative AI (Gemini)
-   **Linting:** ESLint
-   **CSS Extras:** PostCSS, TailwindCSS Animate

## 🚀 Começando

### Pré-requisitos

-   Conta no Firebase (com Realtime Database e Authentication configurados)
-   Chave de API do Google AI Studio (para a LLM Gemini)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/MierzwaMatheus/mythoscape.git
cd mythoscape

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie o arquivo de exemplo e preencha com suas credenciais
cp .env.example .env
# Edite o arquivo .env com suas chaves do Firebase e Google AI Studio:
# VITE_FIREBASE_API_KEY=SUA_CHAVE_FIREBASE
# VITE_FIREBASE_AUTH_DOMAIN=SEU_DOMINIO_AUTH
# VITE_FIREBASE_DATABASE_URL=SUA_URL_RTDB
# VITE_FIREBASE_PROJECT_ID=SEU_ID_PROJETO
# VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
# VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID
# VITE_FIREBASE_APP_ID=SEU_APP_ID
# VITE_GEMINI_API_KEY=SUA_CHAVE_GEMINI

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Para build de produção
npm run build
```

## 📱 Demonstração

<div align="center">
  <p>Explore MythoScape em ação:</p>
  <a href="https://mythoscape-gm.web.app/" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #8E44AD; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
     Acessar Demonstração Ao Vivo
  </a>
  <p style="margin-top: 10px;">(Requer login com conta Google para interagir)</p>
</div>

## 🔮 Roadmap

-   [ ] **Criação de Personagens Aprimorada:** Interface guiada para criação de fichas de personagem com integração da IA para sugestões.
-   [ ] **Integração com Sistemas de Regras Populares:** Suporte opcional para D&D 5e, Pathfinder, etc., com automação de rolagens e mecânicas.
-   [ ] **Geração de Conteúdo Visual por IA:** Mapas de batalha, tokens de personagens/NPCs e ilustrações de cenas geradas sob demanda.
-   [ ] **Modo Multijogador Cooperativo:** Permitir que múltiplos jogadores participem da mesma campanha, interagindo com a IA e entre si.
-   [ ] **Ferramentas Avançadas para o Mestre (Humano):** Opção para um mestre humano intervir, customizar e guiar a IA.
-   [ ] **Internacionalização (i18n):** Suporte para múltiplos idiomas.

## 🤝 Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

<details>
<summary><b>Guia de Contribuição Rápido</b></summary>

1.  Faça um Fork do projeto (`https://github.com/MierzwaMatheus/mythoscape/fork`)
2.  Crie sua Feature Branch (`git checkout -b feature/NovaFeatureIncrivel`)
3.  Commit suas mudanças (`git commit -m 'Adiciona NovaFeatureIncrivel'`)
4.  Push para a Branch (`git push origin feature/NovaFeatureIncrivel`)
5.  Abra um Pull Request

</details>

## 📜 Licença

Este projeto está licenciado sob a Licença MIT.

## 🙏 Agradecimentos

-   A [Google AI Studio](https://ai.google.dev/) por fornecer a poderosa API Gemini.
-   A equipe do [Firebase](https://firebase.google.com/) pela infraestrutura robusta de backend.
-   Às comunidades [React](https://reactjs.org/), [Vite](https://vitejs.dev/) e [TailwindCSS](https://tailwindcss.com/) pelas excelentes ferramentas de desenvolvimento.
-   A todos os jogadores e mestres de RPG que inspiraram a criação desta plataforma.

---

<div align="center">
  <p>
    <a href="https://github.com/MierzwaMatheus/mythoscape/issues">Reportar Bug</a> •
    <a href="https://github.com/MierzwaMatheus/mythoscape/issues">Solicitar Feature</a>
  </p>
  
  <p>Feito com ❤️ para aventureiros e contadores de histórias</p>
  
  <a href="https://github.com/MierzwaMatheus">
    <img src="https://avatars.githubusercontent.com/u/48134874?v=4" alt="Matheus Mierzwa" width="100" style="border-radius: 50%;"/>
  </a>
</div>
