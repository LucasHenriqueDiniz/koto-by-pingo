import { vocabulary } from '../data/vocabulary';
import type { VocabularyWord } from '../types/vocabulary';

/** Palavras que têm kanji (forma escrita diferente da leitura em kana). */
const KANJI_POOL: VocabularyWord[] = vocabulary.filter(w => w.japanese !== w.kana);

/**
 * Palavra do dia — escolha determinística pela data local: o mesmo dia sempre
 * retorna a mesma palavra (igual para todos os usuários), sem precisar de servidor.
 * Muda automaticamente à meia-noite local.
 */
export function getWordOfDay(date = new Date()): VocabularyWord {
  const pool = KANJI_POOL.length > 0 ? KANJI_POOL : vocabulary;
  const dayIndex = Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000,
  );
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool[idx];
}
