export type KanjiJlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type KanjiTrainingMode =
  | 'flashcards'
  | 'multiple_choice'
  | 'matching_pairs'
  | 'tracing';

export interface KanjiExampleWord {
  /** id em vocabulary.ts, quando a palavra já existe lá. */
  vocabId?: string;
  japanese: string;
  reading: string;
  meaningPt: string;
}

export interface KanjiItem {
  /** ex: 'kj-001' — sequencial, não derivado do caractere (kanji têm variantes/compostos que podem colidir). */
  id: string;
  character: string;
  /** Múltiplas leituras on'yomi (em katakana, convenção tradicional). */
  onyomi: string[];
  /** Múltiplas leituras kun'yomi (em hiragana). */
  kunyomi: string[];
  meaningPt: string;
  jlptLevel: KanjiJlptLevel;
  strokeCount?: number;
  /** ids em vocabulary.ts, só quando o kanji já aparece numa palavra cadastrada. */
  exampleWordIds?: string[];
  /** Fallback inline quando não há entry em vocabulary.ts ainda. */
  examples?: KanjiExampleWord[];
}
