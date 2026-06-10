export interface KanaProgress {
  attempts: KanaAttemptRecord[];
  lastUpdated: string;
}

export interface KanaAttemptRecord {
  kanaId: string;
  correct: boolean;
  timestamp: string;
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
