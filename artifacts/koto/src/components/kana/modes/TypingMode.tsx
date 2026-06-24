import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KanaItem } from '../../../types/kana';
import { useKanaTrainer } from '../../../hooks/useKanaTrainer';
import { KanaInput } from '../KanaInput';
import { KanaStats } from '../KanaStats';
import { MaterialIcon } from '../../ui/MaterialIcon';

interface TypingModeProps {
  items: KanaItem[];
  showRomajiHint?: boolean;
}

const KANA_COLOR = {
  idle: undefined,
  correct: '#00846d',
  wrong: '#ba1a1a',
} as const;

export function TypingMode({ items, showRomajiHint = false }: TypingModeProps) {
  const {
    current,
    feedback,
    sessionCorrect,
    sessionTotal,
    sessionAccuracy,
    submit,
    next,
    skip,
    endSession,
  } = useKanaTrainer(items);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => () => endSession(), [endSession]);

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

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum caractere disponível para este filtro.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-[0.14em] text-center">
        Escreva o romaji deste kana
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + feedback}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="font-japanese select-none leading-none text-[7.5rem] sm:text-[8.5rem]"
          style={{ color: KANA_COLOR[feedback] }}
          data-testid="kana-character-display"
        >
          {current.character}
        </motion.div>
      </AnimatePresence>

      {showRomajiHint && feedback === 'idle' && (
        <p className="text-sm text-[--color-text-secondary] -mt-3">
          Leitura: <span className="font-mono font-semibold text-foreground">{current.romaji}</span>
        </p>
      )}

      <div className="h-5 text-center -mt-1">
        {feedback === 'correct' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold" style={{ color: '#00846d' }}>
            Correto! Continue.
          </motion.p>
        )}
        {feedback === 'wrong' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold" style={{ color: '#ba1a1a' }}>
            Quase. A resposta era <span className="font-mono">{current.romaji}</span>.
          </motion.p>
        )}
      </div>

      {feedback === 'idle' ? (
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center bg-background border-2 border-border rounded-2xl focus-within:border-primary transition-colors pl-1">
            <MaterialIcon name="keyboard" size={20} className="text-muted-foreground/40 ml-3 mr-1 flex-shrink-0" />
            <KanaInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              className="flex-1 min-w-0 border-none outline-none bg-transparent py-3.5 px-2 text-lg text-center text-foreground placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 m-1.5 font-bold text-sm disabled:opacity-40 transition-opacity flex-shrink-0"
              data-testid="kana-submit-btn"
            >
              Verificar
            </button>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground self-center font-semibold transition-colors"
            data-testid="kana-skip-btn"
          >
            Pular
          </button>
        </div>
      ) : (
        <button
          onClick={handleNext}
          autoFocus
          className="px-12 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="kana-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
