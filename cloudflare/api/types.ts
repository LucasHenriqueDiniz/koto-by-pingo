export interface Env {
  DB: D1Database;
  CLERK_SECRET_KEY: string;
  /**
   * `production` on the deployed Worker, set in `[vars]` in wrangler.toml. The test
   * bypass in `auth.ts` requires this to be exactly `development`, so the deployed
   * Worker cannot enable it and neither can a Worker whose vars are missing.
   */
  ENVIRONMENT: string;
  /**
   * Only ever set in `.dev.vars` for a local `wrangler dev` session, and never with
   * `wrangler secret put`. If this is set on a deployed Worker, someone made a
   * mistake — see the comment on `testBypassUserId`.
   */
  TEST_BYPASS_SECRET?: string;
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
