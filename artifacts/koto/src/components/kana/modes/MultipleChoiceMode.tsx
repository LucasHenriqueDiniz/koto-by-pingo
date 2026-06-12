import { useState, useCallback, useEffect, useMemo } from 'react';
import type { KanaItem } from '../../../types/kana';
import { allKana } from '../../../data/kana';
import { shuffle } from '../../../utils/scoring';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaCharacterCard } from '../KanaCharacterCard';
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
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <KanaCharacterCard character={current.character} />

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

      {selected && (
        <button
          onClick={handleNext}
          autoFocus
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kana-mc-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
