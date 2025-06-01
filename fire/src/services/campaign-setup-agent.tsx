/**
 * CampaignSetupAgent - Agente especialista para criar o setup inicial de uma campanha
 * 
 * Este agente é responsável por gerar o setup inicial completo de uma campanha
 * com base no resumo do cenário, tom e nome fornecidos pelo usuário.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ref, set, push, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// Tipos
export interface CampaignSetupInput {
  campaignName: string;
  settingSummary: string;
  tone: string;
  playerMode: string;
  duration: string;
  system: string;
  userId: string;
}

export interface CampaignSetupResult {
  campaignId: string;
  initialMessage: string;
  htmlInitialMessage: string;
}

/**
 * Gera um ID único com prefixo para diferentes tipos de entidades
 */
const generateEntityId = (type: string) => {
  const shortUuid = uuidv4().split('-')[0];
  return `${type}_${shortUuid}`;
};

/**
 * Agente para criar o setup inicial completo de uma campanha
 */
export const CampaignSetupAgent = async (
  setupInput: CampaignSetupInput,
  userApiKey: string
): Promise<CampaignSetupResult> => {
  const genAI = initializeGoogleAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Prompt para o agente de setup de campanha
  const setupPrompt = `
  # Agente de Setup Inicial de Campanha MythoScape
  
  Você é o Agente de Setup Inicial de Campanha do MythoScape, especialista em criar o setup completo para novas campanhas de RPG.
  
  ## Dados da Campanha
  - Nome: ${setupInput.campaignName}
  - Resumo do Cenário: ${setupInput.settingSummary}
  - Tom: ${setupInput.tone}
  - Modo de Jogo: ${setupInput.playerMode}
  - Duração Estimada: ${setupInput.duration}
  - Sistema: ${setupInput.system}
  
  ## Sua Tarefa
  
  Com base nas informações fornecidas, crie um setup inicial completo para a campanha, incluindo:
  
  1. **História do Mundo**: Crie uma história rica e detalhada para o mundo da campanha, adequada ao tom especificado.
  
  2. **História da Campanha**: Desenvolva uma narrativa específica para esta campanha, com eventos passados e atuais.
  
  3. **Localização Inicial**: Crie uma localização inicial detalhada onde o jogador começará sua jornada.
     - Deve incluir nome, descrição, pontos de interesse, e características únicas
     - Deve ter separação entre conhecimento do mestre e conhecimento do jogador
     - Deve incluir pelo menos 3 pontos de interesse dentro da localização principal
  
  4. **NPCs Iniciais**: Crie pelo menos 3 NPCs interessantes que estarão presentes na localização inicial.
     - Cada NPC deve ter nome, descrição, personalidade, motivações e relação com a localização
     - Deve haver separação entre conhecimento do mestre e conhecimento do jogador
     - Pelo menos um NPC deve ter uma quest ou informação importante
  
  5. **Eventos Iniciais**: Crie pelo menos 2 eventos que estão ocorrendo ou prestes a ocorrer na localização inicial.
  
  6. **Facções**: Crie pelo menos 2 facções relevantes para a campanha, com objetivos e relações entre si.
  
  7. **Quests Iniciais**: Crie pelo menos 2 quests iniciais que o jogador pode seguir.
     - Cada quest deve ter objetivos claros, recompensas e possíveis complicações
     - Deve haver separação entre conhecimento do mestre e conhecimento do jogador
  
  8. **Mensagem Inicial**: Crie uma mensagem narrativa de boas-vindas para iniciar a campanha.
     - Deve ser envolvente e estabelecer o tom da campanha
     - Deve descrever o que o jogador vê, ouve e sente ao iniciar a aventura
     - Deve terminar com um gancho que incentive o jogador a agir
  
  ## Formatação HTML
  
  Formate a mensagem inicial usando tags HTML para melhorar a legibilidade:
  * Use <h1>, <h2>, <h3> para títulos e subtítulos
  * Use <p> para parágrafos
  * Use <strong> ou <b> para texto em negrito
  * Use <em> ou <i> para texto em itálico
  * Use <hr> para separar seções
  * Use <blockquote> para citações ou diálogos importantes
  * Use <div class="description"> para descrições de ambiente
  * Use <div class="npc-dialogue"> para diálogos de NPCs
  
  ## Estrutura de Dados
  
  Retorne um objeto JSON com a seguinte estrutura:
  
  \`\`\`json
  {
    "campaignSetup": {
      "metadata": {
        "campaignName": "Nome da Campanha",
        "system": "pathfinder2e",
        "tone": "Tom da Campanha",
        "playerMode": "Modo de Jogo",
        "duration": "Duração Estimada",
        "settingSummary": "Resumo refinado do cenário",
        "createdAt": 1622548800000,
        "updatedAt": 1622548800000,
        "createdBy": "${setupInput.userId}",
        "isActive": true,
        "maxPlayers": 5,
        "isPrivate": true,
        "inviteCode": "código-aleatório"
      },
      "world": {
        "history": "História detalhada do mundo",
        "campaignHistory": "História específica desta campanha",
        "regions": {
          "region_id1": {
            "id": "region_id1",
            "name": "Nome da Região",
            "description": "Descrição da região",
            "climate": "Clima da região",
            "terrain": "Terreno predominante",
            "masterKnowledge": {
              "secrets": "Segredos da região conhecidos apenas pelo mestre"
            },
            "playerKnowledge": {
              "visibleDescription": "O que os jogadores sabem sobre a região"
            }
          }
        },
        "locations": {
          "location_id1": {
            "id": "location_id1",
            "name": "Nome da Localização Inicial",
            "type": "settlement",
            "regionId": "region_id1",
            "description": "Descrição detalhada da localização",
            "points_of_interest": {
              "poi_id1": {
                "id": "poi_id1",
                "name": "Nome do Ponto de Interesse",
                "description": "Descrição do ponto de interesse",
                "parentLocationId": "location_id1",
                "npcIds": ["npc_id1"],
                "masterKnowledge": {
                  "secrets": "Segredos deste local"
                },
                "playerKnowledge": {
                  "visibleDescription": "O que os jogadores podem ver"
                }
              }
            },
            "masterKnowledge": {
              "secrets": "Segredos da localização",
              "hiddenFeatures": "Características ocultas"
            },
            "playerKnowledge": {
              "visibleDescription": "O que os jogadores podem ver inicialmente",
              "knownFeatures": "Características conhecidas pelos jogadores"
            }
          }
        },
        "factions": {
          "faction_id1": {
            "id": "faction_id1",
            "name": "Nome da Facção",
            "description": "Descrição da facção",
            "goals": ["Objetivo 1", "Objetivo 2"],
            "alignment": "Alinhamento",
            "headquarters": "location_id1",
            "relationships": {
              "faction_id2": "rival"
            },
            "masterKnowledge": {
              "secrets": "Segredos da facção"
            },
            "playerKnowledge": {
              "knownInfo": "Informações conhecidas pelos jogadores"
            }
          }
        }
      },
      "npcs": {
        "npc_id1": {
          "id": "npc_id1",
          "name": "Nome do NPC",
          "type": "humanoid",
          "ancestry": "human",
          "class": "merchant",
          "level": 3,
          "locationId": "location_id1",
          "factionId": "faction_id1",
          "disposition": {
            "default": "friendly"
          },
          "dialogue": {
            "greeting": "Saudação inicial do NPC",
            "topics": {
              "topic1": "Resposta sobre o tópico 1",
              "topic2": "Resposta sobre o tópico 2"
            }
          },
          "questIds": ["quest_id1"],
          "relationships": {
            "npc_id2": "friend"
          },
          "masterKnowledge": {
            "secretMotives": "Motivações secretas do NPC",
            "hiddenItems": ["Item secreto"],
            "plotRelevance": "Importância para a trama"
          },
          "playerKnowledge": {
            "appearance": "Aparência visível do NPC",
            "knownInfo": "Informações conhecidas sobre o NPC"
          }
        }
      },
      "quests": {
        "quest_id1": {
          "id": "quest_id1",
          "name": "Nome da Quest",
          "description": "Descrição da quest",
          "type": "side",
          "giver": "npc_id1",
          "status": "available",
          "rewards": {
            "xp": 100,
            "gold": 50,
            "items": ["item_id1"]
          },
          "objectives": {
            "objective_id1": {
              "description": "Descrição do objetivo",
              "status": "incomplete",
              "locationId": "location_id1",
              "targetId": "npc_id2"
            }
          },
          "masterKnowledge": {
            "secretObjectives": ["Objetivo secreto"],
            "twists": "Reviravoltas na quest"
          },
          "playerKnowledge": {
            "knownObjectives": ["Objetivo conhecido"],
            "knownRewards": "Recompensas conhecidas"
          }
        }
      },
      "events": {
        "event_id1": {
          "id": "event_id1",
          "name": "Nome do Evento",
          "description": "Descrição do evento",
          "type": "social",
          "locationId": "location_id1",
          "timing": "immediate",
          "involvedNpcIds": ["npc_id1", "npc_id2"],
          "triggers": ["player_arrives"],
          "outcomes": ["outcome1", "outcome2"],
          "masterKnowledge": {
            "hiddenTriggers": ["trigger_secreto"],
            "secretOutcomes": ["outcome_secreto"]
          },
          "playerKnowledge": {
            "visibleSigns": "Sinais visíveis do evento"
          }
        }
      },
      "gameState": {
        "currentLocationId": "location_id1",
        "activeQuestIds": ["quest_id1"],
        "weather": {
          "current": "clear",
          "temperature": "mild"
        },
        "timeOfDay": "morning",
        "combat": {
          "inCombat": false
        }
      },
      "initialMessage": "Mensagem inicial em texto simples",
      "htmlInitialMessage": "Mensagem inicial formatada com HTML"
    }
  }
  \`\`\`
  
  Certifique-se de que todas as entidades tenham IDs únicos e que as relações entre elas sejam mantidas através desses IDs. Use os prefixos apropriados para cada tipo de entidade (location_, npc_, quest_, etc.).
  `;

  try {
    // Gerar o setup da campanha
    const result = await model.generateContent(setupPrompt);
    const text = result.response.text();
    
    // Extrair o JSON da resposta
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido");
    }
    
    const setupData = JSON.parse(jsonMatch[1]);
    
    // Criar a campanha no Firebase
    const campaignRef = push(ref(database, 'campaigns'));
    const campaignId = campaignRef.key;
    
    if (!campaignId) {
      throw new Error("Falha ao criar referência da campanha");
    }
    
    // Estruturar os dados para o Firebase
    const campaignData = {
      metadata: setupData.campaignSetup.metadata,
      world: {
        history: setupData.campaignSetup.world.history,
        campaignHistory: setupData.campaignSetup.world.campaignHistory,
        regions: setupData.campaignSetup.world.regions,
        locations: setupData.campaignSetup.world.locations,
        factions: setupData.campaignSetup.world.factions
      },
      npcs: setupData.campaignSetup.npcs,
      quests: setupData.campaignSetup.quests,
      events: setupData.campaignSetup.events,
      gameState: setupData.campaignSetup.gameState,
      players: {
        [setupInput.userId]: {
          // Dados iniciais do jogador
          characterName: "",
          level: 1,
          experience: 0,
          inventory: {
            items: {},
            currency: {
              platinum: 0,
              gold: 10,
              silver: 0,
              copper: 0
            }
          }
        }
      },
      rules: {},
      history: {
        chat: {
          // Mensagem inicial do sistema
          [push(ref(database, `campaigns/${campaignId}/history/chat`)).key]: {
            timestamp: Date.now(),
            userId: "gm",
            type: "system",
            content: setupData.campaignSetup.initialMessage,
            htmlContent: setupData.campaignSetup.htmlInitialMessage
          }
        },
        events: {},
        journal: {}
      }
    };
    
    // Atualizar o banco de dados
    await set(ref(database, `campaigns/${campaignId}`), campaignData);
    
    // Adicionar referência à campanha no perfil do usuário
    await update(ref(database, `users/${setupInput.userId}/campaigns`), {
      [campaignId]: {
        role: "gamemaster"
      }
    });
    
    return {
      campaignId,
      initialMessage: setupData.campaignSetup.initialMessage,
      htmlInitialMessage: setupData.campaignSetup.htmlInitialMessage
    };
    
  } catch (error) {
    console.error("Erro ao criar setup da campanha:", error);
    throw error;
  }
};

// Configuração do Google AI
const initializeGoogleAI = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

export default CampaignSetupAgent;
