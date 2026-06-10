import { storageGet, storageSet, storageClear } from '../../utils/storage';
import { generateId } from '../../utils/scoring';
import { vocabulary } from '../../data/vocabulary';
import type {
  KanaProgress,
  VocabProgress,
  WordProgressRecord,
  ExamAttemptRecord,
  StudySessionRecord,
} from './progress.types';
import type { WordAttemptInput, WeakReason } from '../../types/vocabulary';

const KEYS = {
  KANA: 'kana_progress',
  VOCAB: 'vocab_progress',
  WORD_PROGRESS: 'word_progress',
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
    if (!a.correct) mistakes[a.kanaId] = (mistakes[a.kanaId] ?? 0) + 1;
  }
  return mistakes;
}

export function getKanaAccuracy(): number {
  const { attempts } = getKanaProgress();
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter(a => a.correct).length / attempts.length) * 100);
}

/** Per-kana stats map: kanaId → { attempts, correct } */
export function getKanaStatsMap(): Record<string, { attempts: number; correct: number }> {
  const { attempts } = getKanaProgress();
  const map: Record<string, { attempts: number; correct: number }> = {};
  for (const a of attempts) {
    if (!map[a.kanaId]) map[a.kanaId] = { attempts: 0, correct: 0 };
    map[a.kanaId].attempts += 1;
    if (a.correct) map[a.kanaId].correct += 1;
  }
  return map;
}

export function getWeakKana(ids: string[], limit = 50): string[] {
  const map = getKanaStatsMap();
  return ids
    .filter(id => {
      const s = map[id];
      return s && s.attempts >= 3 && (s.correct / s.attempts) < 0.6;
    })
    .sort((a, b) => {
      const sa = map[a], sb = map[b];
      return (sa.correct / sa.attempts) - (sb.correct / sb.attempts);
    })
    .slice(0, limit);
}

export function getMasteredKana(ids: string[]): string[] {
  const map = getKanaStatsMap();
  return ids.filter(id => {
    const s = map[id];
    return s && s.attempts >= 5 && (s.correct / s.attempts) >= 0.85;
  });
}

export function getNeverSeenKana(ids: string[]): string[] {
  const map = getKanaStatsMap();
  return ids.filter(id => !map[id]);
}

export function getKanaFilterStats(ids: string[]) {
  return {
    total: ids.length,
    neverSeen: getNeverSeenKana(ids).length,
    weak: getWeakKana(ids).length,
    mastered: getMasteredKana(ids).length,
  };
}

// ---------- LEGACY VOCAB (aggregate) ----------
export function getVocabProgress(): VocabProgress {
  return storageGet<VocabProgress>(KEYS.VOCAB) ?? { attempts: [], lastUpdated: '' };
}

export function getVocabAccuracy(): number {
  const { attempts } = getVocabProgress();
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter(a => a.correct).length / attempts.length) * 100);
}

// ---------- WORD-LEVEL PROGRESS ----------
export function getWordProgressMap(): Record<string, WordProgressRecord> {
  return storageGet<Record<string, WordProgressRecord>>(KEYS.WORD_PROGRESS) ?? {};
}

export function recordWordAttempt(input: WordAttemptInput): void {
  const map = getWordProgressMap();
  const now = new Date().toISOString();

  if (!map[input.wordId]) {
    map[input.wordId] = {
      wordId: input.wordId,
      attempts: 0,
      correct: 0,
      lastSeen: now,
      weakReasons: { reading: 0, meaning: 0, listening: 0, typing: 0 },
    };
  }

  map[input.wordId].attempts += 1;
  map[input.wordId].lastSeen = now;
  if (input.correct) {
    map[input.wordId].correct += 1;
  } else if (input.weakReason) {
    map[input.wordId].weakReasons[input.weakReason] += 1;
  }

  storageSet(KEYS.WORD_PROGRESS, map);

  // Also update legacy aggregate progress
  const legacyProg = getVocabProgress();
  legacyProg.attempts.push({ vocabId: input.wordId, correct: input.correct, timestamp: now });
  legacyProg.lastUpdated = now;
  storageSet(KEYS.VOCAB, legacyProg);
}

export function recordVocabAttempt(vocabId: string, correct: boolean): void {
  recordWordAttempt({ wordId: vocabId, correct, mode: 'flashcards' });
}

export function getWordProgress(): WordProgressRecord[] {
  return Object.values(getWordProgressMap());
}

export function getWeakWords(limit = 10): string[] {
  const map = getWordProgressMap();
  return Object.values(map)
    .filter(w => w.attempts >= 3 && (w.correct / w.attempts) < 0.6)
    .sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts))
    .slice(0, limit)
    .map(w => w.wordId);
}

export function getMasteredWords(): string[] {
  const map = getWordProgressMap();
  return Object.values(map)
    .filter(w => w.attempts >= 5 && (w.correct / w.attempts) >= 0.85)
    .map(w => w.wordId);
}

export function getNeverSeenWords(): string[] {
  const map = getWordProgressMap();
  return vocabulary.map(w => w.id).filter(id => !map[id]);
}

export function getVocabStats() {
  const map = getWordProgressMap();
  const all = vocabulary.map(w => w.id);
  const neverSeen = getNeverSeenWords();
  const mastered = getMasteredWords();
  const weak = getWeakWords(100);
  const seen = all.filter(id => !!map[id]);

  const weakReasonTotals = { reading: 0, meaning: 0, listening: 0, typing: 0 };
  for (const rec of Object.values(map)) {
    weakReasonTotals.reading += rec.weakReasons.reading;
    weakReasonTotals.meaning += rec.weakReasons.meaning;
    weakReasonTotals.listening += rec.weakReasons.listening;
    weakReasonTotals.typing += rec.weakReasons.typing;
  }

  return {
    total: all.length,
    seen: seen.length,
    neverSeen: neverSeen.length,
    mastered: mastered.length,
    weak: weak.length,
    weakReasonTotals,
  };
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
  const vocabStats = getVocabStats();

  const kanaTotal = kanaProg.attempts.length;
  const kanaCorrect = kanaProg.attempts.filter(a => a.correct).length;
  const vocabTotal = vocabProg.attempts.length;
  const vocabCorrect = vocabProg.attempts.filter(a => a.correct).length;
  const totalAttempts = kanaTotal + vocabTotal;
  const totalCorrect = kanaCorrect + vocabCorrect;

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
    overallAccuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    examsCompleted: exams.length,
    sessionsCount: sessions.length,
    topMistakes,
    vocabStats,
  };
}

// ---------- RESET ----------
export function resetAllProgress(): void {
  storageClear();
}
