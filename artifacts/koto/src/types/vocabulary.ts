export type VocabularyTrainingMode =
  | 'flashcards'
  | 'word_selection'
  | 'matching_pairs'
  | 'translation_quiz';

export type WeakReason = 'reading' | 'meaning' | 'listening' | 'typing';

export interface VocabularyExample {
  japanese: string;
  kana: string;
  meaningPt: string;
}

export interface VocabularyWord {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  meaningPt: string;
  category: string;
  level: string;
  tags?: string[];
  examples?: VocabularyExample[];
}

export interface WordAttemptInput {
  wordId: string;
  correct: boolean;
  weakReason?: WeakReason;
  mode: VocabularyTrainingMode;
}
