export type KanaScript = 'hiragana' | 'katakana';

/** Script filter used by the pages (keeps 'mixed' for hiragana+katakana). */
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
  /** Gojuon row (e.g. 'a', 'ka'... 'wa', 'n', 'ga'... 'pa', 'ky', 'sh'...). */
  row: string;
  /** Column/vowel (e.g. 'a','i','u','e','o', or 'n' for ん/ン). */
  column: string;
  /** ids of kana that look or sound alike. */
  similarTo?: string[];
  examples?: KanaExample[];
}
