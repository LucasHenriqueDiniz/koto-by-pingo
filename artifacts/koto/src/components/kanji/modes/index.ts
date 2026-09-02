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

/** Training mode → component map. Used by KanjiTrainPage to render the active mode. */
export const KANJI_MODE_COMPONENTS: Record<KanjiTrainingMode, ComponentType<KanjiModeComponentProps>> = {
  flashcards: FlashcardsMode,
  multiple_choice: MultipleChoiceMode,
  matching_pairs: MatchingPairsMode,
  tracing: TracingMode,
};
