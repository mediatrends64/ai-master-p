
export interface LearningModule {
  id: string;
  titleKey: string;
  subtitleKey: string;
  emoji: string;
  descriptionKey: string;
  progress: number; // A value from 0 to 100
  content: {
    titleKey: string;
    textKey: string;
    example?: string;
  }[];
}

export interface Persona {
  nameKey: string;
  descriptionKey: string;
  englishName: string;
}

export interface PromptAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  rewrittenPrompt: string;
  translatedRewrittenPrompt?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface SavedChat {
  name: string;
  messages: Message[];
}

export interface SavedPrompt {
  name: string;
  task: string;
  context: string;
  references: string;
  persona: Persona | null;
}