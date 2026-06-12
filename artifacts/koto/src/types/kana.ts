export type KanaScript = 'hiragana' | 'katakana';

/** Filtro de script usado nas páginas (mantém 'mixed' para hiragana+katakana). */
export type KanaType = 'hiragana' | 'katakana' | 'mixed';

export type KanaGroup = 'basic' | 'dakuten' | 'handakuten' | 'yoon';

export type KanaTrainingMode =
  | 'flashcards'
  | 'typing'
  | 'multiple_choice'
  | 'matching_pairs'
  | 'listening'
  | 'word_builder'
  | 'tracing';

export interface KanaExample {
  word: string;
  reading: string;
  meaningPt: string;
}

export interface KanaItem {
  id: string;
  character: string;
  romaji: string;
  script: KanaScript;
  group: KanaGroup;
  /** Linha do gojuon (ex: 'a', 'ka'... 'wa', 'n', 'ga'... 'pa', 'ky', 'sh'...). */
  row: string;
  /** Coluna/vogal (ex: 'a','i','u','e','o' ou 'n' para ん/ン). */
  column: string;
  /** ids de kana visualmente ou foneticamente parecidos. */
  similarTo?: string[];
  examples?: KanaExample[];
}
