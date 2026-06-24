import { useState, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import type { KanaItem } from '../../../types/kana';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { recordTracingPractice, getTracingPracticeMap, recordKanaAttempt } from '../../../services/progress/progress.local';
import { DrawingCanvas } from '../DrawingCanvas';
import { fetchStrokes } from '../../../data/strokeData';
import { MaterialIcon } from '../../ui/MaterialIcon';

interface TracingModeProps {
  items: KanaItem[];
  showRomajiHint?: boolean;
}

export function TracingMode({ items, showRomajiHint }: TracingModeProps) {
  const { current, next } = useKanaQueue(items);
  const [practiceMap, setPracticeMap] = useState(() => getTracingPracticeMap());
  const [strokes, setStrokes] = useState<string[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);

  // Free-practice (any kanji)
  const [freeChar, setFreeChar] = useState('');
  const [freeMode, setFreeMode] = useState(false);

  const activeChar = freeMode ? freeChar : (current?.character ?? '');

  // Carrega os traços (usados como guia no canvas só depois da dica revelada, no modo kana)
  useEffect(() => {
    if (!activeChar) return;
    fetchStrokes(activeChar).then(setStrokes);
  }, [activeChar]);

  useEffect(() => {
    setHintRevealed(false);
  }, [current]);

  const handleRevealHint = useCallback(() => setHintRevealed(true), []);

  const handlePracticed = useCallback(() => {
    if (freeMode || !current) return;
    recordTracingPractice(current.id);
    recordKanaAttempt(current.id, !hintRevealed, { mode: 'tracing', group: current.group });
    setPracticeMap(getTracingPracticeMap());
    next();
  }, [current, freeMode, hintRevealed, next]);

  if (!freeMode && !current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum caractere disponível para este filtro.
      </div>
    );
  }

  const practiceCount = !freeMode && current ? (practiceMap[current.id] ?? 0) : 0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {/* Aviso: aqui é teste de desenho — ordem dos traços fica em Aprender */}
      <Link
        href="/kana/aprender"
        className="flex items-center gap-2 text-xs text-[--color-text-secondary] hover:text-primary transition-colors w-fit"
      >
        <MaterialIcon name="info" size={15} />
        Quer ver a ordem dos traços antes? Consulte Aprender
      </Link>

      {/* Free kanji toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFreeMode(f => !f)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            freeMode
              ? 'bg-primary/10 border-primary/30 text-primary font-medium'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          {freeMode ? '← Voltar para kana' : 'Praticar qualquer kanji'}
        </button>
      </div>

      {/* Free kanji input */}
      {freeMode && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            maxLength={1}
            value={freeChar}
            onChange={e => setFreeChar(e.target.value.slice(-1))}
            placeholder="漢"
            className="w-16 h-14 text-3xl text-center border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          />
          <p className="text-xs text-muted-foreground flex-1">
            Digite um caractere (kanji, hiragana ou katakana) para desenhar.
          </p>
        </div>
      )}

      {/* Prompt + dica (kana mode) */}
      {!freeMode && current && (
        <div className="flex items-center justify-between">
          {hintRevealed ? (
            <div
              className="text-5xl font-bold"
              style={{ fontFamily: "'Noto Sans JP', sans-serif", color: '#E5484D' }}
              data-testid="kana-tracing-character"
            >
              {current.character}
            </div>
          ) : (
            <button
              onClick={handleRevealHint}
              className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
              data-testid="kana-tracing-reveal-hint-btn"
            >
              <MaterialIcon name="visibility" size={15} />
              Mostrar dica
            </button>
          )}
          <div className="text-right">
            {hintRevealed && showRomajiHint && (
              <p className="text-sm text-muted-foreground">{current.romaji}</p>
            )}
            {hintRevealed && (
              <p className="text-xs" style={{ color: '#E5484D' }}>conta como errado</p>
            )}
            {practiceCount > 0 && (
              <p className="text-xs text-muted-foreground">praticado {practiceCount}×</p>
            )}
          </div>
        </div>
      )}

      {!freeMode && current && !hintRevealed && (
        <p className="text-xs text-muted-foreground -mt-2">Desenhe este kana de memória.</p>
      )}

      {/* Teste de desenho */}
      {activeChar && <DrawingCanvas strokes={freeMode || hintRevealed ? strokes : []} />}

      {/* Actions (kana mode only) */}
      {!freeMode && current && (
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
      )}
    </div>
  );
}
