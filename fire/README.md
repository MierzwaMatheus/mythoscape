# MythoScape

MythoScape é uma plataforma web que utiliza a LLM Gemini para mestrar campanhas de RPG para jogadores, oferecendo uma experiência intuitiva e colaborativa.

## Objetivo

Permitir que jogadores participem de campanhas de RPG mestradas pela LLM Gemini, centralizando informações, comunicação e ferramentas em um só lugar.

## Funcionalidades Principais

- **Criação de Campanhas:** Fluxo guiado para criar campanhas, definindo nome, sistema, tom, duração e resumo do cenário.
- **Dashboard:** Visualização e acesso rápido às campanhas em que o usuário participa, seja como mestre (GM) ou jogador.
- **Jogo Online:** Cada campanha possui uma área de jogo com chat, ferramentas e abas laterais para organização.
- **Organização:** Interface para manter campanhas, personagens e informações organizadas.

## Como funciona

1. **Home:** Apresenta o propósito da plataforma e direciona para o dashboard ou criação de campanha.
2. **Dashboard:** Lista todas as campanhas do usuário, permitindo acesso rápido ou criação de novas.
3. **Criação de Campanha:** Processo em etapas para definir detalhes da campanha.
4. **Área de Jogo:** Cada campanha tem uma página dedicada com chat e abas laterais para recursos do jogo.

## Tecnologias Utilizadas

- **React + TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (estilização)
- **Radix UI** e **shadcn/ui** (componentes de interface)
- **React Router** (rotas)
- **React Query** (gerenciamento de dados)
- **Lucide** (ícones)
- **Firebase** (back-end e autenticação)
- **ESLint** (padrões de código)
- **PostCSS** e **TailwindCSS Animate** (animações e pós-processamento CSS)

## Regras e Boas Práticas

- **Código:** Segue padrões do ESLint para React e TypeScript.
- **Estilo:** Utiliza TailwindCSS com customização de cores e temas.
- **Componentização:** Componentes reutilizáveis, organizados em pastas.
- **IDs:** Prefira IDs para elementos que serão estilizados ou manipulados via TypeScript.
- **Simplicidade:** Lógica de programação simples, concisa e otimizada.
- **Consistência Visual:** Siga o padrão de cores e espaçamentos definidos no Tailwind.

## Como rodar o projeto

```bash
# Instale as dependências
npm install

# Rode o projeto em modo desenvolvimento
npm run dev

# Para build de produção
npm run build
```
