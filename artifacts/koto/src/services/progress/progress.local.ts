import { storageGet, storageSet, storageClear } from '../../utils/storage';
import { generateId } from '../../utils/scoring';
import type {
  KanaProgress,
  KanaAttemptRecord,
  VocabProgress,
  VocabAttemptRecord,
  ExamAttemptRecord,
  StudySessionRecord,
} from './progress.types';

const KEYS = {
  KANA: 'kana_progress',
  VOCAB: 'vocab_progress',
  EXAMS: 'exam_attempts',
  SESSIONS: 'sessions',
} as const;

// ---------- KANA ----------
export function getKanaProgress(): KanaProgress {
  return storageGet<KanaProgress>(KEYS.KANA) ?? { attempts: [], lastUpdated: '' };
}

export function recordKanaAttempt(kanaId: string, correct: boolean): void {
  const progress = getKanaProgress();
  progress.attempts.push({ kanaId, correct, timestamp: new Date().toISOString() });
  progress.lastUpdated = new Date().toISOString();
  storageSet(KEYS.KANA, progress);
}

export function getKanaMistakes(): Record<string, number> {
  const { attempts } = getKanaProgress();
  const mistakes: Record<string, number> = {};
  for (const a of attempts) {
    if (!a.correct) {
      mistakes[a.kanaId] = (mistakes[a.kanaId] ?? 0) + 1;
    }
  }
  return mistakes;
}

export function getKanaAccuracy(): number {
  const { attempts } = getKanaProgress();
  if (attempts.length === 0) return 0;
  const correct = attempts.filter(a => a.correct).length;
  return Math.round((correct / attempts.length) * 100);
}

// ---------- VOCAB ----------
export function getVocabProgress(): VocabProgress {
  return storageGet<VocabProgress>(KEYS.VOCAB) ?? { attempts: [], lastUpdated: '' };
}

export function recordVocabAttempt(vocabId: string, correct: boolean): void {
  const progress = getVocabProgress();
  progress.attempts.push({ vocabId, correct, timestamp: new Date().toISOString() });
  progress.lastUpdated = new Date().toISOString();
  storageSet(KEYS.VOCAB, progress);
}

export function getVocabAccuracy(): number {
  const { attempts } = getVocabProgress();
  if (attempts.length === 0) return 0;
  const correct = attempts.filter(a => a.correct).length;
  return Math.round((correct / attempts.length) * 100);
}

// ---------- EXAMS ----------
export function getExamAttempts(): ExamAttemptRecord[] {
  return storageGet<ExamAttemptRecord[]>(KEYS.EXAMS) ?? [];
}

export function saveExamAttempt(attempt: Omit<ExamAttemptRecord, 'id'>): ExamAttemptRecord {
  const attempts = getExamAttempts();
  const full: ExamAttemptRecord = { ...attempt, id: generateId() };
  attempts.push(full);
  storageSet(KEYS.EXAMS, attempts);
  return full;
}

// ---------- SESSIONS ----------
export function getSessions(): StudySessionRecord[] {
  return storageGet<StudySessionRecord[]>(KEYS.SESSIONS) ?? [];
}

export function saveSession(session: Omit<StudySessionRecord, 'id'>): void {
  const sessions = getSessions();
  sessions.push({ ...session, id: generateId() });
  storageSet(KEYS.SESSIONS, sessions);
}

// ---------- SUMMARY ----------
export function getProgressSummary() {
  const kanaProg = getKanaProgress();
  const vocabProg = getVocabProgress();
  const exams = getExamAttempts();
  const sessions = getSessions();

  const kanaTotal = kanaProg.attempts.length;
  const kanaCorrect = kanaProg.attempts.filter(a => a.correct).length;
  const vocabTotal = vocabProg.attempts.length;
  const vocabCorrect = vocabProg.attempts.filter(a => a.correct).length;

  const totalAttempts = kanaTotal + vocabTotal;
  const totalCorrect = kanaCorrect + vocabCorrect;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const mistakes = getKanaMistakes();
  const topMistakes = Object.entries(mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kanaId, count]) => ({ kanaId, count }));

  return {
    kanaTotal,
    kanaCorrect,
    kanaAccuracy: getKanaAccuracy(),
    vocabTotal,
    vocabCorrect,
    vocabAccuracy: getVocabAccuracy(),
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    examsCompleted: exams.length,
    sessionsCount: sessions.length,
    topMistakes,
  };
}

// ---------- RESET ----------
export function resetAllProgress(): void {
  storageClear();
}
