import { vocabulary } from '../data/vocabulary';
import type { VocabularyWord } from '../types/vocabulary';

/** Words that have kanji (written form different from the kana reading). */
const KANJI_POOL: VocabularyWord[] = vocabulary.filter(w => w.japanese !== w.kana);

/**
 * Word of the day — deterministic pick from the local date: the same day always
 * returns the same word (identical for every user), with no server involved.
 * It rolls over automatically at local midnight.
 */
export function getWordOfDay(date = new Date()): VocabularyWord {
  const pool = KANJI_POOL.length > 0 ? KANJI_POOL : vocabulary;
  const dayIndex = Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000,
  );
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool[idx];
}
