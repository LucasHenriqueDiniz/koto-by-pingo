import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KanaItem } from '../../../types/kana';
import { allKana } from '../../../data/kana';
import { shuffle } from '../../../utils/scoring';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../KanaStats';

interface MultipleChoiceModeProps {
  items: KanaItem[];
}

export function MultipleChoiceMode({ items }: MultipleChoiceModeProps) {
  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue(items);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => () => endSession(), [endSession]);

  const options = useMemo(() => {
    if (!current) return [];
    const pool = allKana.filter(k => k.script === current.script && k.romaji !== current.romaji);
    const distractors = shuffle(pool).slice(0, 3).map(k => k.romaji);
    return shuffle([current.romaji, ...distractors]);
  }, [current]);

  const handleSelect = useCallback((romaji: string) => {
    if (!current || selected) return;
    setSelected(romaji);
    const isCorrect = romaji === current.romaji;
    recordKanaAttempt(current.id, isCorrect, { mode: 'multiple_choice', group: current.group });
    registerResult(isCorrect);
  }, [current, selected, registerResult]);

  const handleNext = useCallback(() => {
    setSelected(null);
    next();
  }, [next]);

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
        Escolha o romaji correto
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="font-japanese select-none leading-none text-[7.5rem] sm:text-[8.5rem]"
          data-testid="kana-mc-character-display"
        >
          {current.character}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 w-full" data-testid="kana-mc-options">
        {options.map(romaji => {
          const isCorrect = romaji === current.romaji;
          const isSelected = romaji === selected;
          let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-50';
          }
          return (
            <button
              key={romaji}
              onClick={() => handleSelect(romaji)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3 text-center font-mono font-semibold transition-all ${cls}`}
              data-testid={`kana-mc-option-${romaji}`}
            >
              {romaji}
            </button>
          );
        })}
      </div>

      <div className="h-5 text-center -mt-1">
        {selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold"
            style={{ color: selected === current.romaji ? '#00846d' : '#ba1a1a' }}
          >
            {selected === current.romaji ? 'Correto! Continue.' : (
              <>Quase. A resposta era <span className="font-mono">{current.romaji}</span>.</>
            )}
          </motion.p>
        )}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          autoFocus
          className="px-12 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="kana-mc-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
