import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KanjiItem } from '../../../types/kanji';
import { kanji as allKanji } from '../../../data/kanji';
import { shuffle } from '../../../utils/scoring';
import { recordKanjiAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../../kana/KanaStats';

interface MultipleChoiceModeProps {
  items: KanjiItem[];
}

export function MultipleChoiceMode({ items }: MultipleChoiceModeProps) {
  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue(items);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => () => endSession('kanji'), [endSession]);

  const options = useMemo(() => {
    if (!current) return [];
    const pool = allKanji.filter(k => k.jlptLevel === current.jlptLevel && k.meaningPt !== current.meaningPt);
    const distractors = shuffle(pool).slice(0, 3).map(k => k.meaningPt);
    return shuffle([current.meaningPt, ...distractors]);
  }, [current]);

  const handleSelect = useCallback((meaning: string) => {
    if (!current || selected) return;
    setSelected(meaning);
    const isCorrect = meaning === current.meaningPt;
    recordKanjiAttempt(current.id, isCorrect, { mode: 'multiple_choice', jlptLevel: current.jlptLevel });
    registerResult(isCorrect);
  }, [current, selected, registerResult]);

  const handleNext = useCallback(() => {
    setSelected(null);
    next();
  }, [next]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum kanji disponível para este filtro.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-[0.14em] text-center">
        Escolha o significado correto
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="font-japanese select-none leading-none text-[7.5rem] sm:text-[8.5rem]"
          data-testid="kanji-mc-character-display"
        >
          {current.character}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 w-full" data-testid="kanji-mc-options">
        {options.map(meaning => {
          const isCorrect = meaning === current.meaningPt;
          const isSelected = meaning === selected;
          let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-50';
          }
          return (
            <button
              key={meaning}
              onClick={() => handleSelect(meaning)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3 text-center font-semibold transition-all ${cls}`}
              data-testid={`kanji-mc-option-${meaning}`}
            >
              {meaning}
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
            style={{ color: selected === current.meaningPt ? '#00846d' : '#ba1a1a' }}
          >
            {selected === current.meaningPt ? 'Correto! Continue.' : (
              <>Quase. A resposta era <span className="font-semibold">{current.meaningPt}</span>.</>
            )}
          </motion.p>
        )}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          autoFocus
          className="px-12 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="kanji-mc-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
