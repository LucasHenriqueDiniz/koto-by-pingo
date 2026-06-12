import { useState, useCallback } from 'react';
import type { KanaItem } from '../../../types/kana';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { recordTracingPractice, getTracingPracticeMap } from '../../../services/progress/progress.local';
import { KanaCharacterCard } from '../KanaCharacterCard';

interface TracingModeProps {
  items: KanaItem[];
}

/** Modo Traçado — placeholder até a implementação de canvas com ordem dos traços (ver docs/TODO_TRACING.md). */
export function TracingMode({ items }: TracingModeProps) {
  const { current, next } = useKanaQueue(items);
  const [practiceMap, setPracticeMap] = useState(() => getTracingPracticeMap());

  const handlePracticed = useCallback(() => {
    if (!current) return;
    recordTracingPractice(current.id);
    setPracticeMap(getTracingPracticeMap());
    next();
  }, [current, next]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum caractere disponível para este filtro.
      </div>
    );
  }

  const practiceCount = practiceMap[current.id] ?? 0;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-foreground w-full text-center">
        <p className="font-medium mb-0.5">Em construção</p>
        <p className="text-muted-foreground text-xs">
          O traçado com guia de ordem dos traços ainda não está disponível. Por enquanto, pratique no papel e marque como praticado.
        </p>
      </div>

      <KanaCharacterCard character={current.character} romaji={current.romaji} showRomaji />

      {practiceCount > 0 && (
        <p className="text-xs text-muted-foreground" data-testid="kana-tracing-practice-count">
          Praticado {practiceCount}x
        </p>
      )}

      <div className="flex gap-2 w-full">
        <button
          onClick={() => next()}
          className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
          data-testid="kana-tracing-skip-btn"
        >
          Pular
        </button>
        <button
          onClick={handlePracticed}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kana-tracing-practiced-btn"
        >
          Marcar como praticado
        </button>
      </div>
    </div>
  );
}
