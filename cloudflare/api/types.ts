export interface Env {
  DB: D1Database;
  CLERK_SECRET_KEY: string;
  ENVIRONMENT: string;
}

export interface KanaAttemptInput {
  kanaId: string;
  correct: boolean;
  timestamp?: string;
  skipped?: boolean;
  mode?: string;
  group?: string;
  sessionId?: string;
}

export interface WordAttemptInput {
  wordId: string;
  correct: boolean;
  weakReason?: 'reading' | 'meaning' | 'listening' | 'typing';
  mode?: string;
  sessionId?: string;
}

export interface ExamAnswerInput {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface ExamAttemptInput {
  examId: string;
  examSlug: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: ExamAnswerInput[];
}

export interface StudySessionInput {
  module: 'kana' | 'vocabulary' | 'listening' | 'exam';
  startedAt: string;
  endedAt: string;
  itemsCount: number;
  correctCount: number;
}

export interface WordProgressInput {
  wordId: string;
  attempts: number;
  correct: number;
  lastSeen: string;
  weakReasons: {
    reading: number;
    meaning: number;
    listening: number;
    typing: number;
  };
}

export interface SyncPayload {
  displayName?: string;
  email?: string;
  kana?: KanaAttemptInput[];
  wordProgress?: WordProgressInput[];
  exams?: ExamAttemptInput[];
  sessions?: StudySessionInput[];
}
