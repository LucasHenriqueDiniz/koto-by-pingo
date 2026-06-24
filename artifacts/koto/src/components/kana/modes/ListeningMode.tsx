import { useState, useCallback, useEffect, useMemo } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import type { KanaItem } from '../../../types/kana';
import { allKana } from '../../../data/kana';
import { shuffle } from '../../../utils/scoring';
import { speakJapanese } from '../../../utils/japaneseAudio';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../KanaStats';

interface ListeningModeProps {
  items: KanaItem[];
}

const WAVE_BARS = 7;

export function ListeningMode({ items }: ListeningModeProps) {
  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue(items);
  const [speaking, setSpeaking] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => () => endSession(), [endSession]);

  const options = useMemo(() => {
    if (!current) return [];
    const pool = allKana.filter(k => k.script === current.script && k.romaji !== current.romaji);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([current, ...distractors]);
  }, [current]);

  const speak = useCallback(() => {
    if (!current || speaking) return;
    speakJapanese(current.character, 0.8, () => setSpeaking(true), () => setSpeaking(false));
  }, [current, speaking]);

  const handleSelect = useCallback((romaji: string) => {
    if (!current || selected) return;
    setSelected(romaji);
    const isCorrect = romaji === current.romaji;
    recordKanaAttempt(current.id, isCorrect, { mode: 'listening', group: current.group });
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
      <div className="bg-background border border-border rounded-2xl px-8 py-10 flex flex-col items-center gap-5 w-full">
        <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-[0.14em] text-center">
          Ouça e escolha o kana correto
        </p>

        <button
          onClick={speak}
          disabled={speaking}
          className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-70"
          data-testid="kana-listening-play-btn"
        >
          <MaterialIcon name="volume_up" filled size={42} className="text-primary-foreground" />
        </button>

        <div className="flex items-center gap-1 h-7" aria-hidden="true">
          {Array.from({ length: WAVE_BARS }).map((_, i) => (
            <span
              key={i}
              className={`w-[3px] h-full rounded-full bg-primary/50 ${speaking ? 'animate-kana-wave' : ''}`}
              style={{ animationDelay: `${i * 0.1}s`, transform: speaking ? undefined : 'scaleY(0.3)' }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full" data-testid="kana-listening-options">
        {options.map(opt => {
          const isCorrect = opt.romaji === current.romaji;
          const isSelected = opt.romaji === selected;
          let cls = 'border-border bg-card hover:border-primary cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7]';
            else cls = 'border-border bg-card opacity-40';
          }
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.romaji)}
              disabled={!!selected}
              className={`border-2 rounded-2xl py-7 flex items-center justify-center transition-all ${cls}`}
              data-testid={`kana-listening-option-${opt.romaji}`}
            >
              <span className="font-japanese text-4xl font-semibold text-foreground">{opt.character}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="text-sm font-bold -mt-1" style={{ color: selected === current.romaji ? '#2F9E44' : '#E5484D' }}>
          {selected === current.romaji ? 'Correto! Continue.' : (
            <>Quase. A resposta era <span className="font-mono">{current.romaji}</span>.</>
          )}
        </p>
      )}

      {selected && (
        <button
          onClick={handleNext}
          autoFocus
          className="px-12 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
          data-testid="kana-listening-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
