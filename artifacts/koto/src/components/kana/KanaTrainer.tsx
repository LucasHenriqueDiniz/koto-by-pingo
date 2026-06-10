import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KanaType } from '../../types/kana';
import { useKanaTrainer } from '../../hooks/useKanaTrainer';
import { KanaInput } from './KanaInput';
import { KanaStats } from './KanaStats';

interface KanaTrainerProps {
  type: KanaType;
}

export function KanaTrainer({ type }: KanaTrainerProps) {
  const {
    current,
    feedback,
    sessionCorrect,
    sessionTotal,
    sessionAccuracy,
    submit,
    next,
    skip,
  } = useKanaTrainer(type);

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    submit(inputValue);
  }, [inputValue, submit]);

  const handleNext = useCallback(() => {
    setInputValue('');
    next();
  }, [next]);

  const handleSkip = useCallback(() => {
    setInputValue('');
    skip();
  }, [skip]);

  if (!current) return null;

  const feedbackStyles = {
    idle: '',
    correct: 'border-[#2F9E44] bg-[#DCFCE7]',
    wrong: 'border-[#E5484D] bg-[#FFE5E7]',
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* Character display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + feedback}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className={`w-44 h-44 flex items-center justify-center rounded-2xl border-2 shadow-sm transition-colors duration-200 ${
            feedback === 'idle' ? 'border-border bg-card' : feedbackStyles[feedback]
          }`}
          data-testid="kana-character-display"
        >
          <span
            className="text-8xl font-normal select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {current.character}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Feedback message */}
      <div className="h-6 text-center">
        {feedback === 'correct' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium"
            style={{ color: '#2F9E44' }}
          >
            Correto. Continue.
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium"
            style={{ color: '#E5484D' }}
          >
            Quase. A resposta era{' '}
            <span className="font-bold font-japanese">{current.romaji}</span>.
          </motion.p>
        )}
      </div>

      {/* Input */}
      {feedback === 'idle' ? (
        <div className="w-full space-y-3">
          <KanaInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity"
              data-testid="kana-submit-btn"
            >
              Verificar
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
              data-testid="kana-skip-btn"
            >
              Pular
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleNext}
          autoFocus
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kana-next-btn"
        >
          Próximo
        </button>
      )}

      {/* Session stats */}
      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
