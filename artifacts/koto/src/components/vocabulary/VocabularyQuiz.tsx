import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';
import { shuffle } from '../../utils/scoring';
import { recordVocabAttempt } from '../../services/progress/progress.local';

interface VocabularyQuizProps {
  words: VocabularyWord[];
}

function buildOptions(correct: VocabularyWord, pool: VocabularyWord[]): { id: string; text: string }[] {
  const distractors = pool.filter(w => w.id !== correct.id);
  const shuffled = shuffle(distractors).slice(0, 3);
  return shuffle([
    { id: correct.id, text: correct.meaningPt },
    ...shuffled.map(w => ({ id: w.id, text: w.meaningPt })),
  ]);
}

export function VocabularyQuiz({ words }: VocabularyQuizProps) {
  const [queue] = useState(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[index % queue.length];
  const options = useState(() => buildOptions(current, words))[0];
  const [currentOptions, setCurrentOptions] = useState(() => buildOptions(current, words));

  const handleSelect = useCallback((optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    const isCorrect = optionId === current.id;
    recordVocabAttempt(current.id, isCorrect);
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
  }, [selected, current]);

  const handleNext = useCallback(() => {
    const nextIndex = (index + 1) % queue.length;
    const next = queue[nextIndex];
    setCurrentOptions(buildOptions(next, words));
    setSelected(null);
    setIndex(nextIndex);
  }, [index, queue, words]);

  if (!current) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto">
      {/* Stats */}
      {total > 0 && (
        <div className="flex items-center gap-4 text-sm justify-center">
          <span className="text-muted-foreground">Acertos: <strong className="text-foreground">{correct}/{total}</strong></span>
          <span className="text-muted-foreground">
            Precisão: <strong className="text-foreground">{Math.round((correct / total) * 100)}%</strong>
          </span>
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
          data-testid="quiz-question"
        >
          <p className="text-xs text-muted-foreground mb-3">O que significa?</p>
          <span
            className="text-5xl font-medium"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {current.japanese}
          </span>
          {current.japanese !== current.kana && (
            <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {current.kana}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {currentOptions.map(option => {
          const isCorrect = option.id === current.id;
          const isSelected = option.id === selected;
          let style = 'border-border bg-card text-foreground hover:bg-muted';
          if (selected) {
            if (isCorrect) style = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) style = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else style = 'border-border bg-card text-muted-foreground opacity-60';
          }
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3 text-sm font-medium text-center transition-all ${style}`}
              data-testid={`quiz-option-${option.id}`}
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
          data-testid="quiz-next-btn"
        >
          Próxima
        </motion.button>
      )}
    </div>
  );
}
