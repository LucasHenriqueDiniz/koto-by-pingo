export type KanjiJlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type KanjiTrainingMode =
  | 'flashcards'
  | 'multiple_choice'
  | 'matching_pairs'
  | 'tracing';

export interface KanjiExampleWord {
  /** id in vocabulary.ts, when the word already exists there. */
  vocabId?: string;
  japanese: string;
  reading: string;
  meaningPt: string;
}

export interface KanjiItem {
  /** e.g. 'kj-001' — sequential, not derived from the character (kanji have variants/compounds that can collide). */
  id: string;
  character: string;
  /** Multiple on'yomi readings (in katakana, by traditional convention). */
  onyomi: string[];
  /** Multiple kun'yomi readings (in hiragana). */
  kunyomi: string[];
  meaningPt: string;
  jlptLevel: KanjiJlptLevel;
  strokeCount?: number;
  /** ids in vocabulary.ts, only when the kanji already appears in a registered word. */
  exampleWordIds?: string[];
  /** Inline fallback when there is no vocabulary.ts entry yet. */
  examples?: KanjiExampleWord[];
}
