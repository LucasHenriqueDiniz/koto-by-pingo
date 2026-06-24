import { useMemo } from 'react';
import type { KanaItem } from '../../types/kana';
import { getKanaStatsMap } from '../../services/progress/progress.local';

interface BentoCharacterGridProps {
  items: KanaItem[];
}

type MasteryState = 'mastered' | 'learning' | 'unseen';

function classify(attempts: number, correct: number): MasteryState {
  if (attempts === 0) return 'unseen';
  if (attempts >= 5 && correct / attempts >= 0.85) return 'mastered';
  return 'learning';
}

/** Grade "bento" de todos os kana do filtro, com estado visual de domínio (dado real). */
export function BentoCharacterGrid({ items }: BentoCharacterGridProps) {
  const statsMap = useMemo(() => getKanaStatsMap(), []);

  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map(kana => {
        const s = statsMap[kana.id];
        const attempts = s?.attempts ?? 0;
        const correct = s?.correct ?? 0;
        const state = classify(attempts, correct);
        const ratio = attempts > 0 ? correct / attempts : 0;

        const cellClass =
          state === 'mastered'
            ? 'bg-[hsl(var(--tertiary))]/10 border-[hsl(var(--tertiary))]/40'
            : state === 'learning'
            ? 'bg-card border-border'
            : 'bg-card border-border opacity-40';

        return (
          <div key={kana.id} className="group">
            <div
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative transition-all group-hover:border-primary group-hover:shadow-sm ${cellClass}`}
              title={`${kana.romaji.toUpperCase()} — ${attempts > 0 ? `${Math.round(ratio * 100)}% (${attempts}x)` : 'nunca visto'}`}
            >
              <span className="text-2xl font-bold text-foreground font-japanese">{kana.character}</span>
              {attempts > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${state === 'mastered' ? 'bg-[hsl(var(--tertiary))]' : 'bg-primary'}`}
                    style={{ width: `${Math.max(10, Math.round(ratio * 100))}%` }}
                  />
                </div>
              )}
            </div>
            <span className="block text-center text-[10px] text-[--color-text-secondary] mt-1 uppercase font-bold tracking-tight">
              {kana.romaji}
            </span>
          </div>
        );
      })}
    </div>
  );
}
