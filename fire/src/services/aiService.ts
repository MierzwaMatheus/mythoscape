import { get, ref } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Função para buscar a chave da API do usuário
export async function getUserApiKey(userId: string, database: any): Promise<string | null> {
  const snap = await get(ref(database, `users/${userId}/googleApiKey`));
  return snap.exists() ? snap.val() : null;
}

// Função para montar o prompt completo
export async function buildPrompt({
  promptBase,
  history,
  context,
  userInput
}: {
  promptBase: string;
  history: string[];
  context: any;
  userInput: string;
}) {
  return [
    promptBase,
    '\nHistórico:\n' + history.join('\n'),
    '\nContexto:\n' + JSON.stringify(context),
    '\nUsuário:\n' + userInput
  ].join('\n\n');
}

// Função para chamar a API do Google AI
export async function callGoogleAI({
  apiKey,
  prompt,
  temperature = 0.7,
  maxOutputTokens = 512
}: {
  apiKey: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  if (!apiKey) {
    throw new Error('Chave da API não configurada');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature,
        maxOutputTokens
      }
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Erro na chamada da API:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Chave da API inválida ou não configurada corretamente');
    }
    throw new Error(`Erro na API Google AI: ${error.message}`);
  }
} 