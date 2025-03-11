export interface DialogueMessage {
  id: string;
  speaker: 'user' | 'other';
  text: string;
  emotion?: string; // For displaying different emotional states
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DialogueStep {
  id: string;
  messages: DialogueMessage[];
  prompt?: string;
  choices?: Choice[];
  description?: string; // For narrative text between dialogues
}

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  context: string;
  steps: DialogueStep[];
  currentStepIndex: number;
}

export interface UserProgress {
  correctAnswers: number;
  totalAttempts: number;
  completedScenarios: string[];
} 