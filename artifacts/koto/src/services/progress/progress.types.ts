import type { KanaGroup, KanaTrainingMode } from '../../types/kana';

export interface KanaProgress {
  attempts: KanaAttemptRecord[];
  lastUpdated: string;
}

export interface KanaAttemptRecord {
  kanaId: string;
  correct: boolean;
  timestamp: string;
  /** Tentativa pulada — não conta para acerto/erro nem para domínio/dificuldade. */
  skipped?: boolean;
  mode?: KanaTrainingMode;
  group?: KanaGroup;
}

export interface KanaGroupStats {
  group: KanaGroup;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface KanaCharacterStats {
  kanaId: string;
  attempts: number;
  correct: number;
  errors: number;
  skipped: number;
  accuracy: number;
}

export interface VocabProgress {
  attempts: VocabAttemptRecord[];
  lastUpdated: string;
}

export interface VocabAttemptRecord {
  vocabId: string;
  correct: boolean;
  timestamp: string;
}

export interface WordProgressRecord {
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

export interface ExamAttemptRecord {
  id: string;
  examId: string;
  examSlug: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  answers: { questionId: string; selectedOptionId: string; isCorrect: boolean }[];
}

export interface StudySessionRecord {
  id: string;
  module: 'kana' | 'vocabulary' | 'listening' | 'exam';
  startedAt: string;
  endedAt: string;
  itemsCount: number;
  correctCount: number;
}
