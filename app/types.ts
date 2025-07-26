// AIDEV-NOTE: Core TypeScript definitions for the fortune app
export interface Fortune {
  text: string;
  generatedAt: string; // ISO date string
  id: string;
}

export interface AppState {
  todaysFortune: Fortune | null;
  isLoading: boolean;
  error: string | null;
  hasGeneratedToday: boolean;
}

export interface FortuneApiResponse {
  fortune: string;
  success: boolean;
  error?: string;
}

export type AppView = 'initial' | 'fortune' | 'loading';