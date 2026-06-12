import type { ComponentType } from 'react';
import type { KanaItem, KanaTrainingMode } from '../../../types/kana';
import { TypingMode } from './TypingMode';
import { FlashcardsMode } from './FlashcardsMode';
import { MultipleChoiceMode } from './MultipleChoiceMode';
import { MatchingPairsMode } from './MatchingPairsMode';
import { ListeningMode } from './ListeningMode';
import { WordBuilderMode } from './WordBuilderMode';
import { TracingMode } from './TracingMode';

export { TypingMode, FlashcardsMode, MultipleChoiceMode, MatchingPairsMode, ListeningMode, WordBuilderMode, TracingMode };

interface KanaModeComponentProps {
  items: KanaItem[];
  showRomajiHint?: boolean;
}

/** Mapa de modo de treino → componente. Usado pela KanaTrainPage para renderizar o modo ativo. */
export const KANA_MODE_COMPONENTS: Record<KanaTrainingMode, ComponentType<KanaModeComponentProps>> = {
  typing: TypingMode,
  flashcards: FlashcardsMode,
  multiple_choice: MultipleChoiceMode,
  matching_pairs: MatchingPairsMode,
  listening: ListeningMode,
  word_builder: WordBuilderMode,
  tracing: TracingMode,
};
