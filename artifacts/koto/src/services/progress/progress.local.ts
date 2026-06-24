import { storageGet, storageSet, storageClear } from '../../utils/storage';
import { generateId } from '../../utils/scoring';
import { vocabulary } from '../../data/vocabulary';
import { allKana, KANA_GROUPS } from '../../data/kana';
import type {
  KanaProgress,
  VocabProgress,
  WordProgressRecord,
  ExamAttemptRecord,
  StudySessionRecord,
  KanaGroupStats,
  KanaCharacterStats,
} from './progress.types';
import type { WordAttemptInput, WeakReason } from '../../types/vocabulary';
import type { KanaGroup, KanaTrainingMode } from '../../types/kana';

const KEYS = {
  KANA: 'kana_progress',
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

/** Per-kana stats map: kanaId → { attempts, correct } (tentativas puladas não contam). */
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

/** Per-kana skip count: kanaId → número de vezes pulado. */
export function getKanaSkipMap(): Record<string, number> {
  const { attempts } = getKanaProgress();
  const map: Record<string, number> = {};
  for (const a of attempts) {
    if (a.skipped) map[a.kanaId] = (map[a.kanaId] ?? 0) + 1;
  }
  return map;
}

/** Estatísticas detalhadas de um caractere (tentativas, acertos, erros, pulos, precisão). */
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

/** Taxa de acerto agregada por grupo (basic/dakuten/handakuten/yoon). */
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

/** Reseta apenas o progresso de kana (mantém vocabulário, simulados e sessões). */
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
  const kanaStats = getKanaStats();

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
    kanaStats,
  };
}

// ---------- ATIVIDADE SEMANAL (dado real derivado dos attempts) ----------
export interface DailyActivity {
  /** Data ISO (YYYY-MM-DD) do dia. */
  date: string;
  /** Rótulo curto pt-BR do dia da semana (Seg, Ter...). */
  label: string;
  /** Total de tentativas (kana + vocabulário) registradas no dia. */
  count: number;
  /** Indica se é o dia de hoje. */
  isToday: boolean;
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Atividade dos últimos 7 dias (incluindo hoje), agregando tentativas de kana e
 * vocabulário por data local. Dado 100% real — não depende de gamificação.
 */
export function getWeeklyActivity(): DailyActivity[] {
  const kana = getKanaProgress().attempts;
  const vocab = getVocabProgress().attempts;

  const counts: Record<string, number> = {};
  const tally = (timestamp: string) => {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] ?? 0) + 1;
  };
  kana.forEach(a => tally(a.timestamp));
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
 * Calendário de atividade das últimas N semanas (seg–dom), agregando tentativas
 * de kana e vocabulário por data local. Dado 100% real — não depende de gamificação.
 */
export function getActivityHeatmap(weeks = 10): HeatmapDay[][] {
  const kana = getKanaProgress().attempts;
  const vocab = getVocabProgress().attempts;

  const counts: Record<string, number> = {};
  const tally = (timestamp: string) => {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    counts[key] = (counts[key] ?? 0) + 1;
  };
  kana.forEach(a => tally(a.timestamp));
  vocab.forEach(a => tally(a.timestamp));

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  // Segunda-feira da semana atual.
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

// ---------- TRAÇADO (placeholder, ver docs/TODO_TRACING.md) ----------
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

// ---------- SYNC REMOTO ----------
/** Indica se o progresso local já foi enviado para a conta na nuvem (D1). */
export function hasSyncedToRemote(): boolean {
  return storageGet<boolean>(KEYS.REMOTE_SYNC) ?? false;
}

export function markSyncedToRemote(): void {
  storageSet(KEYS.REMOTE_SYNC, true);
}
