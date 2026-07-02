import { useState, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import type { KanjiItem } from '../../../types/kanji';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { recordTracingPractice, getTracingPracticeMap, recordKanjiAttempt } from '../../../services/progress/progress.local';
import { DrawingCanvas } from '../../kana/DrawingCanvas';
import { fetchStrokes } from '../../../data/strokeData';
import { MaterialIcon } from '../../ui/MaterialIcon';

interface TracingModeProps {
  items: KanjiItem[];
}

export function TracingMode({ items }: TracingModeProps) {
  const { current, next } = useKanaQueue(items);
  const [practiceMap, setPracticeMap] = useState(() => getTracingPracticeMap());
  const [strokes, setStrokes] = useState<string[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);

  useEffect(() => {
    if (!current?.character) return;
    fetchStrokes(current.character).then(setStrokes);
  }, [current]);

  useEffect(() => {
    setHintRevealed(false);
  }, [current]);

  const handleRevealHint = useCallback(() => setHintRevealed(true), []);

  const handlePracticed = useCallback(() => {
    if (!current) return;
    recordTracingPractice(current.id);
    recordKanjiAttempt(current.id, !hintRevealed, { mode: 'tracing', jlptLevel: current.jlptLevel });
    setPracticeMap(getTracingPracticeMap());
    next();
  }, [current, hintRevealed, next]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum kanji disponível para este filtro.
      </div>
    );
  }

  const practiceCount = practiceMap[current.id] ?? 0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <Link
        href="/kanji/aprender"
        className="flex items-center gap-2 text-xs text-[--color-text-secondary] hover:text-primary transition-colors w-fit"
      >
        <MaterialIcon name="info" size={15} />
        Quer ver a ordem dos traços antes? Consulte Aprender
      </Link>

      <div className="flex items-center justify-between">
        {hintRevealed ? (
          <div
            className="text-5xl font-bold"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: '#E5484D' }}
            data-testid="kanji-tracing-character"
          >
            {current.character}
          </div>
        ) : (
          <button
            onClick={handleRevealHint}
            className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
            data-testid="kanji-tracing-reveal-hint-btn"
          >
            <MaterialIcon name="visibility" size={15} />
            Mostrar dica
          </button>
        )}
        <div className="text-right">
          {hintRevealed && (
            <p className="text-sm text-muted-foreground">{current.meaningPt}</p>
          )}
          {hintRevealed && (
            <p className="text-xs" style={{ color: '#E5484D' }}>conta como errado</p>
          )}
          {practiceCount > 0 && (
            <p className="text-xs text-muted-foreground">praticado {practiceCount}×</p>
          )}
        </div>
      </div>

      {!hintRevealed && (
        <p className="text-xs text-muted-foreground -mt-2">Desenhe este kanji de memória.</p>
      )}

      <DrawingCanvas strokes={hintRevealed ? strokes : []} />

      <div className="flex gap-2 w-full pt-1">
        <button
          onClick={() => next()}
          className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
        >
          Pular
        </button>
        <button
          onClick={handlePracticed}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Marcar como praticado
        </button>
      </div>
    </div>
  );
}
