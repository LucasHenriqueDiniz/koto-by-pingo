export interface BaseAttempt {
  id: string;
  timestamp: string;
  correct: boolean;
  timeTakenMs: number;
}

export interface KanaAttempt extends BaseAttempt {
  kanaId: string;
  input: string;
}

export interface VocabAttempt extends BaseAttempt {
  vocabId: string;
}

export interface ExamAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeTakenMs: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  startedAt: string;
  completedAt?: string;
  answers: ExamAnswer[];
  score: number;
  maxScore: number;
}

export interface StudySession {
  id: string;
  startedAt: string;
  endedAt: string;
  module: 'kana' | 'vocabulary' | 'listening' | 'exam';
  itemsCount: number;
  correctCount: number;
}

export interface UserProgressSummary {
  totalStudySessions: number;
  totalTimeMs: number;
  kanaAccuracy: number;
  vocabAccuracy: number;
  examsCompleted: number;
  lastStudyDate: string | null;
}
