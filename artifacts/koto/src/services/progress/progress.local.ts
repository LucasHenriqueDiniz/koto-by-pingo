import { storageGet, storageSet, storageClear } from '../../utils/storage';
import { generateId } from '../../utils/scoring';
import { vocabulary } from '../../data/vocabulary';
import { allKana, KANA_GROUPS } from '../../data/kana';
import { kanji, KANJI_LEVELS } from '../../data/kanji';
import type {
  KanaProgress,
  VocabProgress,
  WordProgressRecord,
  ExamAttemptRecord,
  StudySessionRecord,
  KanaGroupStats,
  KanaCharacterStats,
  KanjiProgress,
  KanjiLevelStats,
  KanjiCharacterStats,
} from './progress.types';
import type { WordAttemptInput, WeakReason } from '../../types/vocabulary';
import type { KanaGroup, KanaTrainingMode } from '../../types/kana';
import type { KanjiJlptLevel, KanjiTrainingMode } from '../../types/kanji';

const KEYS = {
  KANA: 'kana_progress',
  KANJI: 'kanji_progress',
  VOCAB: 'vocab_progress',
  WORD_PROGRESS: 'word_progress',
  EXAMS: 'exam_attempts',
  SESSIONS: 'sessions',
  TRACING: 'tracing_practice',
  REMOTE_SYNC: 'remote_sync',
} as const;

// ---------- KANA ----------
export function getKanaProgress(): KanaProgress {
  return storageGet<KanaProgress>(KEYS.KANA) ?? { attempts: [], lastUpdated: '' };
}

export function recordKanaAttempt(
  kanaId: string,
  correct: boolean,
  opts?: { mode?: KanaTrainingMode; skipped?: boolean; group?: KanaGroup },
): void {
  const progress = getKanaProgress();
  progress.attempts.push({
    kanaId,
    correct,
    timestamp: new Date().toISOString(),
    ...(opts?.skipped ? { skipped: true } : {}),
    ...(opts?.mode ? { mode: opts.mode } : {}),
    ...(opts?.group ? { group: opts.group } : {}),
  });
  progress.lastUpdated = new Date().toISOString();
  storageSet(KEYS.KANA, progress);
}

export function getKanaMistakes(): Record<string, number> {
  const { attempts } = getKanaProgress();
  const mistakes: Record<string, number> = {};
  for (const a of attempts) {
    if (!a.skipped && !a.correct) mistakes[a.kanaId] = (mistakes[a.kanaId] ?? 0) + 1;
  }
  return mistakes;
}

export function getKanaAccuracy(): number {
  const { attempts } = getKanaProgress();
  const counted = attempts.filter(a => !a.skipped);
  if (counted.length === 0) return 0;
  return Math.round((counted.filter(a => a.correct).length / counted.length) * 100);
}

/** Per-kana stats map: kanaId → { attempts, correct } (skipped attempts do not count). */
export function getKanaStatsMap(): Record<string, { attempts: number; correct: number }> {
  const { attempts } = getKanaProgress();
  const map: Record<string, { attempts: number; correct: number }> = {};
  for (const a of attempts) {
    if (a.skipped) continue;
    if (!map[a.kanaId]) map[a.kanaId] = { attempts: 0, correct: 0 };
    map[a.kanaId].attempts += 1;
    if (a.correct) map[a.kanaId].correct += 1;
  }
  return map;
}

/** Per-kana skip count: kanaId → number of times skipped. */
export function getKanaSkipMap(): Record<string, number> {
  const { attempts } = getKanaProgress();
  const map: Record<string, number> = {};
  for (const a of attempts) {
    if (a.skipped) map[a.kanaId] = (map[a.kanaId] ?? 0) + 1;
  }
  return map;
}

/** Detailed stats for one character (attempts, correct, wrong, skips, accuracy). */
export function getKanaCharacterStats(kanaId: string): KanaCharacterStats {
  const stats = getKanaStatsMap()[kanaId];
  const attempts = stats?.attempts ?? 0;
  const correct = stats?.correct ?? 0;
  return {
    kanaId,
    attempts,
    correct,
    errors: attempts - correct,
    skipped: getKanaSkipMap()[kanaId] ?? 0,
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
  };
}

/** Accuracy aggregated by group (basic/dakuten/handakuten/yoon). */
export function getKanaGroupStats(): KanaGroupStats[] {
  const statsMap = getKanaStatsMap();
  const groupOf = new Map(allKana.map(k => [k.id, k.group]));

  const totals: Record<KanaGroup, { attempts: number; correct: number }> = {
    basic: { attempts: 0, correct: 0 },
    dakuten: { attempts: 0, correct: 0 },
    handakuten: { attempts: 0, correct: 0 },
    yoon: { attempts: 0, correct: 0 },
  };

  for (const [kanaId, s] of Object.entries(statsMap)) {
    const group = groupOf.get(kanaId);
    if (!group) continue;
    totals[group].attempts += s.attempts;
    totals[group].correct += s.correct;
  }

  return KANA_GROUPS.map(group => ({
    group,
    attempts: totals[group].attempts,
    correct: totals[group].correct,
    accuracy: totals[group].attempts > 0 ? Math.round((totals[group].correct / totals[group].attempts) * 100) : 0,
  }));
}

/** Resets kana progress only (keeps vocabulary, mock exams and sessions). */
export function resetKanaProgress(): void {
  storageSet(KEYS.KANA, { attempts: [], lastUpdated: new Date().toISOString() });
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

/** Classification stats across all kana (hiragana + katakana). */
export function getKanaStats() {
  const ids = allKana.map(k => k.id);
  const stats = getKanaFilterStats(ids);
  return {
    total: stats.total,
    seen: stats.total - stats.neverSeen,
    neverSeen: stats.neverSeen,
    mastered: stats.mastered,
    weak: stats.weak,
  };
}

// ---------- KANJI ----------
export function getKanjiProgress(): KanjiProgress {
  return storageGet<KanjiProgress>(KEYS.KANJI) ?? { attempts: [], lastUpdated: '' };
}

export function recordKanjiAttempt(
  kanjiId: string,
  correct: boolean,
  opts?: { mode?: KanjiTrainingMode; skipped?: boolean; jlptLevel?: KanjiJlptLevel },
): void {
  const progress = getKanjiProgress();
  progress.attempts.push({
    kanjiId,
    correct,
    timestamp: new Date().toISOString(),
    ...(opts?.skipped ? { skipped: true } : {}),
    ...(opts?.mode ? { mode: opts.mode } : {}),
    ...(opts?.jlptLevel ? { jlptLevel: opts.jlptLevel } : {}),
  });
  progress.lastUpdated = new Date().toISOString();
  storageSet(KEYS.KANJI, progress);
}

/** Per-kanji stats map: kanjiId → { attempts, correct } (skipped attempts do not count). */
export function getKanjiStatsMap(): Record<string, { attempts: number; correct: number }> {
  const { attempts } = getKanjiProgress();
  const map: Record<string, { attempts: number; correct: number }> = {};
  for (const a of attempts) {
    if (a.skipped) continue;
    if (!map[a.kanjiId]) map[a.kanjiId] = { attempts: 0, correct: 0 };
    map[a.kanjiId].attempts += 1;
    if (a.correct) map[a.kanjiId].correct += 1;
  }
  return map;
}

/** Per-kanji skip count: kanjiId → number of times skipped. */
export function getKanjiSkipMap(): Record<string, number> {
  const { attempts } = getKanjiProgress();
  const map: Record<string, number> = {};
  for (const a of attempts) {
    if (a.skipped) map[a.kanjiId] = (map[a.kanjiId] ?? 0) + 1;
  }
  return map;
}

/** Detailed stats for one kanji (attempts, correct, wrong, skips, accuracy). */
export function getKanjiCharacterStats(kanjiId: string): KanjiCharacterStats {
  const stats = getKanjiStatsMap()[kanjiId];
  const attempts = stats?.attempts ?? 0;
  const correct = stats?.correct ?? 0;
  return {
    kanjiId,
    attempts,
    correct,
    errors: attempts - correct,
    skipped: getKanjiSkipMap()[kanjiId] ?? 0,
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
  };
}

/** Accuracy aggregated by JLPT level. */
export function getKanjiLevelStats(): KanjiLevelStats[] {
  const statsMap = getKanjiStatsMap();
  const levelOf = new Map(kanji.map(k => [k.id, k.jlptLevel]));

  const totals: Record<KanjiJlptLevel, { attempts: number; correct: number }> = {
    N5: { attempts: 0, correct: 0 },
    N4: { attempts: 0, correct: 0 },
    N3: { attempts: 0, correct: 0 },
    N2: { attempts: 0, correct: 0 },
    N1: { attempts: 0, correct: 0 },
  };

  for (const [kanjiId, s] of Object.entries(statsMap)) {
    const level = levelOf.get(kanjiId);
    if (!level) continue;
    totals[level].attempts += s.attempts;
    totals[level].correct += s.correct;
  }

  return KANJI_LEVELS.map(level => ({
    level,
    attempts: totals[level].attempts,
    correct: totals[level].correct,
    accuracy: totals[level].attempts > 0 ? Math.round((totals[level].correct / totals[level].attempts) * 100) : 0,
  }));
}

/** Resets kanji progress only (keeps kana, vocabulary, mock exams and sessions). */
export function resetKanjiProgress(): void {
  storageSet(KEYS.KANJI, { attempts: [], lastUpdated: new Date().toISOString() });
}

export function getWeakKanji(ids: string[], limit = 50): string[] {
  const map = getKanjiStatsMap();
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

export function getMasteredKanji(ids: string[]): string[] {
  const map = getKanjiStatsMap();
  return ids.filter(id => {
    const s = map[id];
    return s && s.attempts >= 5 && (s.correct / s.attempts) >= 0.85;
  });
}

export function getNeverSeenKanji(ids: string[]): string[] {
  const map = getKanjiStatsMap();
  return ids.filter(id => !map[id]);
}

export function getKanjiFilterStats(ids: string[]) {
  return {
    total: ids.length,
    neverSeen: getNeverSeenKanji(ids).length,
    weak: getWeakKanji(ids).length,
    mastered: getMasteredKanji(ids).length,
  };
}

/** Classification stats across all seeded kanji. */
export function getKanjiStats() {
  const ids = kanji.map(k => k.id);
  const stats = getKanjiFilterStats(ids);
  return {
    total: stats.total,
    seen: stats.total - stats.neverSeen,
    neverSeen: stats.neverSeen,
    mastered: stats.mastered,
    weak: stats.weak,
  };
}

export function getKanjiAccuracy(): number {
  const { attempts } = getKanjiProgress();
  const counted = attempts.filter(a => !a.skipped);
  if (counted.length === 0) return 0;
  return Math.round((counted.filter(a => a.correct).length / counted.length) * 100);
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
  const kanjiProg = getKanjiProgress();
  const vocabProg = getVocabProgress();
  const exams = getExamAttempts();
  const sessions = getSessions();
  const vocabStats = getVocabStats();
  const kanaStats = getKanaStats();
  const kanjiStats = getKanjiStats();

  const kanaTotal = kanaProg.attempts.length;
  const kanaCorrect = kanaProg.attempts.filter(a => a.correct).length;
  const kanjiTotal = kanjiProg.attempts.length;
  const kanjiCorrect = kanjiProg.attempts.filter(a => a.correct).length;
  const vocabTotal = vocabProg.attempts.length;
  const vocabCorrect = vocabProg.attempts.filter(a => a.correct).length;
  const totalAttempts = kanaTotal + kanjiTotal + vocabTotal;
  const totalCorrect = kanaCorrect + kanjiCorrect + vocabCorrect;

  const mistakes = getKanaMistakes();
  const topMistakes = Object.entries(mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kanaId, count]) => ({ kanaId, count }));

  return {
    kanaTotal,
    kanaCorrect,
    kanaAccuracy: getKanaAccuracy(),
    kanjiTotal,
    kanjiCorrect,
    kanjiAccuracy: getKanjiAccuracy(),
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
    kanaStats,
    kanjiStats,
  };
}

// ---------- WEEKLY ACTIVITY (real data derived from attempts) ----------
export interface DailyActivity {
  /** ISO date (YYYY-MM-DD) of the day. */
  date: string;
  /** Short pt-BR weekday label, as rendered (`Seg`, `Ter`, ...). */
  label: string;
  /** Total attempts (kana + vocabulary) recorded on that day. */
  count: number;
  /** Whether this day is today. */
  isToday: boolean;
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Activity for the last 7 days (today included), aggregating kana and vocabulary
 * attempts by local date. Fully real data — it does not depend on gamification.
 */
export function getWeeklyActivity(): DailyActivity[] {
  const kana = getKanaProgress().attempts;
  const kanjiAttempts = getKanjiProgress().attempts;
  const vocab = getVocabProgress().attempts;

  const counts: Record<string, number> = {};
  const tally = (timestamp: string) => {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] ?? 0) + 1;
  };
  kana.forEach(a => tally(a.timestamp));
  kanjiAttempts.forEach(a => tally(a.timestamp));
  vocab.forEach(a => tally(a.timestamp));

  const today = new Date();
  const days: DailyActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      date: key,
      label: WEEKDAY_LABELS[d.getDay()],
      count: counts[key] ?? 0,
      isToday: i === 0,
    });
  }
  return days;
}

export interface HeatmapDay {
  date: string;
  count: number;
  isToday: boolean;
}

/**
 * Activity calendar for the last N weeks (Mon–Sun), aggregating kana and
 * vocabulary attempts by local date. Fully real data — it does not depend on gamification.
 */
export function getActivityHeatmap(weeks = 10): HeatmapDay[][] {
  const kana = getKanaProgress().attempts;
  const kanjiAttempts = getKanjiProgress().attempts;
  const vocab = getVocabProgress().attempts;

  const counts: Record<string, number> = {};
  const tally = (timestamp: string) => {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] ?? 0) + 1;
  };
  kana.forEach(a => tally(a.timestamp));
  kanjiAttempts.forEach(a => tally(a.timestamp));
  vocab.forEach(a => tally(a.timestamp));

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  // Monday of the current week.
  const mondayOffset = (today.getDay() + 6) % 7;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - mondayOffset);

  const result: HeatmapDay[][] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(currentMonday.getDate() - w * 7);
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      week.push({ date: key, count: counts[key] ?? 0, isToday: key === todayKey });
    }
    result.push(week);
  }
  return result;
}

// ---------- TRACING (placeholder, see docs/TODO_TRACING.md) ----------
export function getTracingPracticeMap(): Record<string, number> {
  return storageGet<Record<string, number>>(KEYS.TRACING) ?? {};
}

export function recordTracingPractice(kanaId: string): void {
  const map = getTracingPracticeMap();
  map[kanaId] = (map[kanaId] ?? 0) + 1;
  storageSet(KEYS.TRACING, map);
}

// ---------- RESET ----------
export function resetAllProgress(): void {
  storageClear();
}

// ---------- REMOTE SYNC ----------
/** Whether local progress has already been pushed to the cloud account (D1). */
export function hasSyncedToRemote(): boolean {
  return storageGet<boolean>(KEYS.REMOTE_SYNC) ?? false;
}

export function markSyncedToRemote(): void {
  storageSet(KEYS.REMOTE_SYNC, true);
}
