import { GoogleGenAI, Type, Chat } from "@google/genai";
import { PromptAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will be mocked.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const baseAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 on the quality of the user's prompt based on TCREI principles."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-3 specific things the user did well in their prompt."
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-3 specific, actionable suggestions for how the user can improve their prompt."
    },
    rewrittenPrompt: {
      type: Type.STRING,
      description: "A rewritten version of the user's prompt that incorporates the suggested improvements."
    }
  },
};

const baseSystemInstruction = `You are an expert AI prompt engineering coach. Your goal is to analyze a user's prompt based on the T.C.R.E.I. framework (Task, Context, References, Evaluation, Iteration).
- Task: Is the action for the AI clear and specific? Is there a persona? Is the format defined?
- Context: Is there enough background information for the AI to understand the request?
- References: Are there examples (few-shot) to guide the AI?
- Evaluation: Does the prompt encourage a verifiable and unbiased response?
- Iteration: Is the prompt structured in a way that is easy to refine?

Provide a concise analysis and a rewritten, improved prompt. Be encouraging and helpful. Respond ONLY with the JSON object as defined in the schema.`;

export const analyzePrompt = async (prompt: string, targetLanguage: string, targetLocale: string): Promise<PromptAnalysis> => {
  if (!API_KEY) {
    // Mock response for development when API key is not available
    const isEnglish = targetLocale === 'en';
    return new Promise(resolve => setTimeout(() => {
      const mockResponse: PromptAnalysis = {
        score: 75,
        strengths: ["Clear task definition.", "Good use of persona."],
        improvements: ["Add more context about the target audience.", "Provide a few-shot example of the desired output style."],
        rewrittenPrompt: `Act as a seasoned travel blogger. Write a 500-word blog post for families with young children (ages 4-8) about the top 3 things to do in San Diego. The tone should be enthusiastic and informative. Structure the output with a main heading for each of the 3 items. For example: "1. Explore Balboa Park".`
      };
      if (!isEnglish) {
        mockResponse.translatedRewrittenPrompt = `[Translated to ${targetLanguage}] Act as a seasoned travel blogger. Write a 500-word blog post for families with young children (ages 4-8) about the top 3 things to do in San Diego. The tone should be enthusiastic and informative. Structure the output with a main heading for each of the 3 items. For example: "1. Explore Balboa Park".`;
      }
      resolve(mockResponse);
    }, 1500));
  }

  const isEnglish = targetLocale === 'en';
  
  // Deep copy to avoid mutation issues
  const analysisSchema = JSON.parse(JSON.stringify(baseAnalysisSchema));
  let systemInstruction = baseSystemInstruction;
  
  if (!isEnglish) {
      analysisSchema.properties.translatedRewrittenPrompt = {
        type: Type.STRING,
        description: `A translated version of the rewrittenPrompt into ${targetLanguage}.`
      };
      systemInstruction += `\n\nFinally, translate the 'rewrittenPrompt' field into ${targetLanguage} and put it in the 'translatedRewrittenPrompt' field.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following prompt: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5,
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as PromptAnalysis;

  } catch (error) {
    console.error("Error analyzing prompt with Gemini:", error);
    throw new Error("Failed to get analysis from AI. Please check your prompt or API key.");
  }
};

// Mock Chat class for offline development
class MockChat {
    async *sendMessageStream(params: { message: string }): AsyncGenerator<{ text: string }, void, unknown> {
        const message = params.message;
        const responseChunks = [
            `This is a mocked response for your message: "${message}". `,
            `The AI is simulating a streaming reply. `,
            `This is the final part of the mock response.`
        ];
        
        for (const chunk of responseChunks) {
            await new Promise(resolve => setTimeout(resolve, 300));
            yield { text: chunk };
        }
    }
}

export const startChat = (): Chat | MockChat => {
  if (!API_KEY) {
    console.log("Using Mock Chat for offline development.");
    return new MockChat();
  }
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: "You are an early model of Gemini, a helpful and friendly AI assistant. Keep your responses concise and to the point."
    }
  });
};
