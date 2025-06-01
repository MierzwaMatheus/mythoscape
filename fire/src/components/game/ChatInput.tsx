import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import useMythoScapeAgents from '@/services/agents-architecture';
import { Button } from '../ui/button';
import { ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';

// JSON completo e válido de regras do Pathfinder 2e
const pathfinderRules = {
  "ancestries": {
    "dwarf": {
      "name": "Anão",
      "description": "Anões são um povo baixo e robusto, conhecidos por sua teimosia, ferocidade e devoção.",
      "hp": 10,
      "size": "Médio",
      "speed": 20,
      "attributeBoosts": ["constitution", "wisdom", "free"],
      "attributeFlaws": ["charisma"],
      "traits": ["anão", "humanoide"],
      "languages": ["anão", "comum"],
      "additionalLanguages": ["gnomo", "goblin", "jotun", "órquico", "subterrâneo", "terrano"],
      "specialAbilities": [
        { "name": "Visão no Escuro", "description": "Você enxerga no escuro e na penumbra tão bem quanto na luz brilhante, embora sua visão no escuro seja em preto e branco." }
      ],
      "heritages": [
        { "id": "ancient_blooded", "name": "Sangue Antigo", "description": "A magia ancestral corre em suas veias. Você ganha o benefício de treinado na perícia Arcana e ganha resistência a magia igual a metade do seu nível (mínimo 1)." },
        { "id": "death_warden", "name": "Guardião da Morte", "description": "Seus ancestrais passaram incontáveis gerações vigiando locais antigos de poder ou sepulturas de parentes honrados. Você ganha resistência a energia negativa igual a metade do seu nível (mínimo 1) e recebe +1 de bônus de circunstância em salvaguardas contra efeitos de necromancia." },
        { "id": "forge", "name": "Forja", "description": "Você tem um corpo adaptado ao calor extremo. Você ganha resistência a fogo igual a metade do seu nível (mínimo 1), e você trata os efeitos ambientais de calor como se fossem um grau menos extremos." },
        { "id": "rock", "name": "Rocha", "description": "Seus ancestrais viveram em cavernas ou túneis rochosos, concedendo-lhe sentidos afiados. Você ganha sentido de tremor (impreciso) com alcance de 10 pés." },
        { "id": "strong_blooded", "name": "Sangue Forte", "description": "Seu sangue corre vigoroso e forte, e você resiste a toxinas. Você ganha resistência a veneno igual a metade do seu nível (mínimo 1), e cada sucesso em uma salvaguarda contra um veneno conta como um sucesso crítico." }
      ]
    },
    "elf": {
      "name": "Elfo",
      "description": "Elfos são um povo alto e de vida longa, com forte tradição de arte e magia.",
      "hp": 6,
      "size": "Médio",
      "speed": 30,
      "attributeBoosts": ["dexterity", "intelligence", "free"],
      "attributeFlaws": ["constitution"],
      "traits": ["elfo", "humanoide"],
      "languages": ["comum", "élfico"],
      "additionalLanguages": ["celestial", "dracônico", "gnoll", "gnomo", "goblin", "órquico", "silvestre"],
      "specialAbilities": [
        { "name": "Visão na Penumbra", "description": "Você enxerga na penumbra tão bem quanto na luz brilhante, e ignora a condição de oculto devido à penumbra." }
      ],
      "heritages": [
        { "id": "arctic", "name": "Ártico", "description": "Você vive em terras congeladas e é resistente ao frio. Você ganha resistência a frio igual a metade do seu nível (mínimo 1), e você trata os efeitos ambientais de frio como se fossem um grau menos extremos." },
        { "id": "cavern", "name": "Caverna", "description": "Você nasceu ou viveu sob a terra, desenvolvendo a capacidade de ver no escuro. Você ganha visão no escuro." },
        { "id": "seer", "name": "Vidente", "description": "Você tem uma conexão inata com o reino dos espíritos e pode sentir coisas que outros não podem. Você ganha o benefício de treinado na perícia Ocultismo e pode lançar a magia detectar magia como um truque inato arcano à vontade." },
        { "id": "whisper", "name": "Sussurro", "description": "Você pode falar mentalmente com aliados próximos. Você pode lançar a magia mensagem como um truque inato arcano à vontade." },
        { "id": "woodland", "name": "Floresta", "description": "Você tem uma conexão especial com as florestas e a natureza. Você ganha o benefício de treinado na perícia Natureza e pode lançar a magia falar com plantas uma vez por dia como uma magia inata primordial de 3º nível." }
      ]
    },
    "human": {
      "name": "Humano",
      "description": "Humanos são diversos e adaptáveis, com amplo potencial e ambições profundas.",
      "hp": 8,
      "size": "Médio",
      "speed": 25,
      "attributeBoosts": ["free", "free"],
      "attributeFlaws": [],
      "traits": ["humano", "humanoide"],
      "languages": ["comum"],
      "additionalLanguages": ["qualquer"],
      "specialAbilities": [],
      "heritages": [
        { "id": "skilled", "name": "Habilidoso", "description": "Seus ancestrais valorizavam a versatilidade e o treinamento. Você se torna treinado em uma perícia de sua escolha." },
        { "id": "versatile", "name": "Versátil", "description": "Humanos se adaptam a uma ampla variedade de circunstâncias. Você ganha um talento geral de 1º nível." },
        { "id": "half_elf", "name": "Meio-Elfo", "description": "Um de seus pais era um elfo, ou seus ancestrais incluíam elfos. Você ganha o traço elfo, visão na penumbra e acesso a heranças e talentos élficos." },
        { "id": "half_orc", "name": "Meio-Orc", "description": "Um de seus pais era um orc, ou seus ancestrais incluíam orcs. Você ganha o traço orc, visão no escuro e acesso a heranças e talentos órquicos." }
      ]
    }
  },
  "classes": {
    "fighter": {
      "name": "Guerreiro",
      "description": "Mestres das armas, guerreiros são incomparáveis em combate armado, usando armas, armaduras e técnicas de combate com habilidade inigualável.",
      "keyAbility": "strength",
      "secondaryAbilities": ["dexterity", "constitution"],
      "hp": 10,
      "proficiencies": {
        "perception": "expert",
        "fortitude": "expert",
        "reflex": "expert",
        "will": "trained",
        "simpleWeapons": "expert",
        "martialWeapons": "expert",
        "unarmedAttacks": "expert",
        "lightArmor": "trained",
        "mediumArmor": "trained",
        "heavyArmor": "trained",
        "unarmored": "trained"
      },
      "classFeatures": [
        { "level": 1, "name": "Ataque de Oportunidade", "description": "Você pode atacar um inimigo que baixa a guarda. Você ganha a reação Ataque de Oportunidade, permitindo atacar um inimigo que se move ou usa uma ação manipular dentro do seu alcance." },
        { "level": 1, "name": "Talento de Guerreiro", "description": "Você ganha um talento de guerreiro de 1º nível." }
      ]
    },
    "rogue": {
      "name": "Ladino",
      "description": "Ladinos são mestres em uma variedade de habilidades, e sempre têm o truque certo para a situação.",
      "keyAbility": "dexterity",
      "secondaryAbilities": ["intelligence", "charisma"],
      "hp": 8,
      "proficiencies": {
        "perception": "expert",
        "fortitude": "trained",
        "reflex": "expert",
        "will": "expert",
        "simpleWeapons": "trained",
        "martialWeapons": "trained",
        "unarmedAttacks": "trained",
        "lightArmor": "trained",
        "unarmored": "trained"
      },
      "classFeatures": [
        { "level": 1, "name": "Ataque Furtivo", "description": "Você ataca alvos desprevenidos. Você causa 1d6 de dano de precisão extra contra alvos desprevenidos." },
        { "level": 1, "name": "Especialista em Perícias", "description": "Você ganha um talento de perícia adicional." },
        { "level": 1, "name": "Talento de Ladino", "description": "Você ganha um talento de ladino de 1º nível." }
      ]
    },
    "wizard": {
      "name": "Mago",
      "description": "Magos são estudiosos dedicados das artes arcanas, capazes de lançar poderosas magias.",
      "keyAbility": "intelligence",
      "secondaryAbilities": ["dexterity", "constitution"],
      "hp": 6,
      "proficiencies": {
        "perception": "trained",
        "fortitude": "trained",
        "reflex": "trained",
        "will": "expert",
        "simpleWeapons": "trained",
        "unarmedAttacks": "trained",
        "unarmored": "trained"
      },
      "classFeatures": [
        { "level": 1, "name": "Lançamento de Magias Arcanas", "description": "Você pode lançar magias arcanas usando a atividade Lançar uma Magia. Você prepara suas magias a partir de um grimório." },
        { "level": 1, "name": "Grimório", "description": "Você tem um grimório contendo 10 truques e magias arcanas de 1º nível." },
        { "level": 1, "name": "Escola Arcana", "description": "Você se especializa em uma das oito escolas de magia, ganhando um poder de foco e um espaço de magia adicional de cada nível que só pode ser usado para preparar magias dessa escola." },
        { "level": 1, "name": "Talento de Mago", "description": "Você ganha um talento de mago de 1º nível." }
      ]
    }
  },
  "backgrounds": {
    "acolyte": {
      "name": "Acólito",
      "description": "Você passou sua juventude em um templo ou mosteiro, estudando tradições religiosas.",
      "attributeBoosts": ["intelligence", "wisdom"],
      "trainedSkills": ["religião", "lore_scribing"],
      "skillFeat": "Student of the Canon"
    },
    "criminal": {
      "name": "Criminoso",
      "description": "Você viveu uma vida de crime, seja como ladrão, contrabandista ou algum outro papel ilícito.",
      "attributeBoosts": ["dexterity", "intelligence"],
      "trainedSkills": ["stealth", "lore_underworld"],
      "skillFeat": "Experienced Smuggler"
    },
    "entertainer": {
      "name": "Artista",
      "description": "Através da música, dança, atuação, contação de histórias ou outra forma de entretenimento, você cativou plateias.",
      "attributeBoosts": ["dexterity", "charisma"],
      "trainedSkills": ["performance", "lore_entertainment"],
      "skillFeat": "Fascinating Performance"
    },
    "farmhand": {
      "name": "Trabalhador Rural",
      "description": "Com as mãos calejadas pelo trabalho árduo, você cresceu entre os campos e estábulos.",
      "attributeBoosts": ["constitution", "wisdom"],
      "trainedSkills": ["athletics", "lore_farming"],
      "skillFeat": "Assurance (Athletics)"
    },
    "guard": {
      "name": "Guarda",
      "description": "Você serviu na guarda, mantendo a lei e protegendo os cidadãos.",
      "attributeBoosts": ["strength", "charisma"],
      "trainedSkills": ["intimidation", "lore_legal"],
      "skillFeat": "Quick Coercion"
    },
    "merchant": {
      "name": "Mercador",
      "description": "Você ganha a vida comprando e vendendo bens, e aprendeu a reconhecer o valor de qualquer item.",
      "attributeBoosts": ["intelligence", "charisma"],
      "trainedSkills": ["diplomacy", "lore_mercantile"],
      "skillFeat": "Bargain Hunter"
    },
    "scholar": {
      "name": "Estudioso",
      "description": "Você dedicou anos ao estudo e pesquisa, acumulando conhecimento em um campo específico.",
      "attributeBoosts": ["intelligence", "wisdom"],
      "trainedSkills": ["arcana", "lore_academia"],
      "skillFeat": "Assurance (Arcana)"
    }
  },
  "skills": {
    "acrobatics": {
      "name": "Acrobacia",
      "attribute": "dexterity",
      "description": "Manter o equilíbrio e realizar manobras acrobáticas.",
      "actions": {
        "balance": "Mover-se em superfícies estreitas ou instáveis.",
        "tumble_through": "Mover-se através do espaço de um inimigo."
      }
    },
    "arcana": {
      "name": "Arcana",
      "attribute": "intelligence",
      "description": "Conhecimento sobre magia arcana, tradições mágicas, criaturas mágicas e planos de existência.",
      "actions": {
        "identify_magic": "Identificar a natureza de um efeito mágico arcano.",
        "learn_spell": "Adicionar uma magia arcana ao seu grimório ou repertório."
      }
    },
    "athletics": {
      "name": "Atletismo",
      "attribute": "strength",
      "description": "Habilidades físicas como escalar, nadar, saltar e aplicar força bruta.",
      "actions": {
        "climb": "Escalar superfícies verticais.",
        "force_open": "Abrir portas trancadas ou bloqueadas.",
        "grapple": "Agarrar um oponente.",
        "high_jump": "Saltar verticalmente.",
        "long_jump": "Saltar horizontalmente.",
        "swim": "Mover-se em água."
      }
    }
  },
  "feats": {
    "general": {
      "toughness": {
        "name": "Resistência",
        "level": 1,
        "prerequisites": [],
        "description": "Você tem uma resistência física excepcional. Você ganha pontos de vida adicionais iguais ao seu nível. Os requisitos para recuperar-se da condição morrendo são reduzidos em 1."
      },
      "fleet": {
        "name": "Ágil",
        "level": 1,
        "prerequisites": [],
        "description": "Você se move mais rápido a pé. Sua Velocidade aumenta em 5 pés."
      }
    },
    "ancestry": {
      "dwarven_weapon_familiarity": {
        "name": "Familiaridade com Armas Anãs",
        "level": 1,
        "prerequisites": ["ancestry:dwarf"],
        "description": "Seu parentesco anão concedeu a você familiaridade com armas anãs. Você está treinado com machados de batalha, picaretas e martelos de guerra."
      },
      "nimble_elf": {
        "name": "Elfo Ágil",
        "level": 1,
        "prerequisites": ["ancestry:elf"],
        "description": "Seus músculos são coordenados com precisão. Seu movimento não provoca ataques de oportunidade de criaturas que não estejam preparadas para sua velocidade."
      }
    },
    "class": {
      "power_attack": {
        "name": "Ataque Poderoso",
        "level": 1,
        "prerequisites": ["class:fighter"],
        "description": "Você faz um único e poderoso ataque que causa dano extra mas é menos preciso. Faça um Ataque com penalidade de -2. Se acertar, você causa dano adicional igual ao seu modificador de Força."
      },
      "sneak_attacker": {
        "name": "Ataque Furtivo Aprimorado",
        "level": 2,
        "prerequisites": ["class:rogue"],
        "description": "Você é especialmente eficaz ao atacar alvos desprevenidos. Seu dano de Ataque Furtivo aumenta para 2d6."
      }
    }
  }
};

export default function ChatInput() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const [value, setValue] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    get(ref(database, `users/${user.uid}/googleApiKey`)).then(snap => {
      if (snap.exists()) setApiKey(snap.val());
    });
  }, [user]);

  const {
    processUserInput,
    loading: processing,
    error: processError
  } = useMythoScapeAgents(campaignId ?? '', user?.uid ?? '', apiKey ?? '');

  async function handleSend(e: React.FormEvent) {
      e.preventDefault();
    if (!value.trim() || loading || !apiKey) return;
    setLoading(true);
    try {
      await processUserInput(value.trim());
      setValue('');
    } catch (err: any) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!apiKey) {
    return (
      <div className="p-4 text-center text-sm text-neutral-600">
        Configure sua chave da Google AI no menu lateral para começar a conversar.
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2 p-2 border-t bg-white">
      <input
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Digite sua mensagem..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading || processing}
      />
      <Button type="submit" disabled={loading || processing || !value.trim()}>
        {loading || processing ? 'Enviando...' : 'Enviar'}
        </Button>
      {(error || processError) && (
        <div className="text-red-500 text-xs ml-2">{error || processError}</div>
      )}
      </form>
  );
}
