import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';
import { shuffle } from '../../utils/scoring';
import { recordWordAttempt } from '../../services/progress/progress.local';

interface TranslationQuizModeProps {
  words: VocabularyWord[];
  onAttempt?: (correct: boolean) => void;
}

function buildMeaningOptions(correct: VocabularyWord, pool: VocabularyWord[]): { id: string; text: string }[] {
  const distractors = shuffle(pool.filter(w => w.id !== correct.id)).slice(0, 3);
  return shuffle([
    { id: correct.id, text: correct.meaningPt },
    ...distractors.map(w => ({ id: w.id, text: w.meaningPt })),
  ]);
}

export function TranslationQuizMode({ words, onAttempt }: TranslationQuizModeProps) {
  const [queue] = useState(() => shuffle([...words]));
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<{ id: string; text: string }[]>(() =>
    buildMeaningOptions(queue[0], words)
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[index % queue.length];

  useEffect(() => {
    setOptions(buildMeaningOptions(current, words));
    setSelected(null);
  }, [index, current, words]);

  const handleSelect = useCallback((optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    const isCorrect = optionId === current.id;
    recordWordAttempt({
      wordId: current.id,
      correct: isCorrect,
      weakReason: isCorrect ? undefined : 'meaning',
      mode: 'translation_quiz',
    });
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
    onAttempt?.(isCorrect);
  }, [selected, current, onAttempt]);

  const handleNext = useCallback(() => {
    setIndex(i => i + 1);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Stats */}
      {total > 0 && (
        <div className="text-sm text-center text-muted-foreground">
          Acertos: <strong className="text-foreground">{correct}/{total}</strong>
          {' — '}
          Precisão: <strong className="text-foreground">{Math.round((correct / total) * 100)}%</strong>
        </div>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="bg-card border-2 border-border rounded-2xl p-8 text-center"
          data-testid="translation-quiz-question"
        >
          <p className="text-xs text-muted-foreground mb-2">O que significa?</p>
          <span
            className="text-5xl font-medium block mb-2"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {current.japanese}
          </span>
          {current.japanese !== current.kana && (
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {current.kana}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => {
          const isCorrect = option.id === current.id;
          const isSelected = option.id === selected;
          let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-50';
          }
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3 text-sm font-medium text-center transition-all ${cls}`}
              data-testid={`translation-quiz-option-${option.id}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="translation-quiz-next-btn"
        >
          Próxima
        </motion.button>
      )}
    </div>
  );
}
