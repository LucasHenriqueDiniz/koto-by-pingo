import type { ComponentType } from 'react';
import type { KanjiItem, KanjiTrainingMode } from '../../../types/kanji';
import { FlashcardsMode } from './FlashcardsMode';
import { MultipleChoiceMode } from './MultipleChoiceMode';
import { MatchingPairsMode } from './MatchingPairsMode';
import { TracingMode } from './TracingMode';

export { FlashcardsMode, MultipleChoiceMode, MatchingPairsMode, TracingMode };

interface KanjiModeComponentProps {
  items: KanjiItem[];
}

/** Mapa de modo de treino → componente. Usado pela KanjiTrainPage para renderizar o modo ativo. */
export const KANJI_MODE_COMPONENTS: Record<KanjiTrainingMode, ComponentType<KanjiModeComponentProps>> = {
  flashcards: FlashcardsMode,
  multiple_choice: MultipleChoiceMode,
  matching_pairs: MatchingPairsMode,
  tracing: TracingMode,
};
