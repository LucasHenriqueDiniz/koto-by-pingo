import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';
import { shuffle } from '../../utils/scoring';
import { recordWordAttempt } from '../../services/progress/progress.local';

interface WordSelectionModeProps {
  words: VocabularyWord[];
  showTranslationHint: boolean;
  onAttempt?: (correct: boolean) => void;
}

function buildReadingOptions(correct: VocabularyWord, pool: VocabularyWord[]): string[] {
  const distractors = shuffle(pool.filter(w => w.id !== correct.id))
    .slice(0, 3)
    .map(w => w.romaji);
  return shuffle([correct.romaji, ...distractors]);
}

export function WordSelectionMode({ words, showTranslationHint, onAttempt }: WordSelectionModeProps) {
  const [queue] = useState(() => shuffle([...words]));
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>(() => buildReadingOptions(queue[0], words));
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[index % queue.length];

  useEffect(() => {
    setOptions(buildReadingOptions(current, words));
    setSelected(null);
  }, [index, current, words]);

  const handleSelect = useCallback((option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === current.romaji;
    recordWordAttempt({
      wordId: current.id,
      correct: isCorrect,
      weakReason: isCorrect ? undefined : 'reading',
      mode: 'word_selection',
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
          data-testid="word-selection-question"
        >
          <p className="text-xs text-muted-foreground mb-1">Qual é a leitura?</p>
          <span
            className="text-5xl font-medium block my-3"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {current.japanese}
          </span>
          {showTranslationHint && (
            <span className="inline-block mt-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {current.meaningPt}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options (romaji) */}
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => {
          const isCorrect = option === current.romaji;
          const isSelected = option === selected;
          let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-50';
          }
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3.5 text-sm font-mono font-medium text-center transition-all ${cls}`}
              data-testid={`word-selection-option-${option}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {selected !== current.romaji && (
            <p className="text-center text-sm text-muted-foreground">
              A leitura correta era{' '}
              <span className="font-bold font-mono text-foreground">{current.romaji}</span>
              {' — '}
              <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{current.kana}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            data-testid="word-selection-next-btn"
          >
            Próxima
          </button>
        </motion.div>
      )}
    </div>
  );
}
