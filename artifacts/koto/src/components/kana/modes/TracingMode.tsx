import { useState, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import type { KanaItem } from '../../../types/kana';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { recordTracingPractice, getTracingPracticeMap } from '../../../services/progress/progress.local';
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

  // Free-practice (any kanji)
  const [freeChar, setFreeChar] = useState('');
  const [freeMode, setFreeMode] = useState(false);

  const activeChar = freeMode ? freeChar : (current?.character ?? '');

  // Carrega os traços apenas como guia leve no canvas (sem ensinar a ordem aqui)
  useEffect(() => {
    if (!activeChar) return;
    fetchStrokes(activeChar).then(setStrokes);
  }, [activeChar]);

  const handlePracticed = useCallback(() => {
    if (freeMode || !current) return;
    recordTracingPractice(current.id);
    setPracticeMap(getTracingPracticeMap());
    next();
  }, [current, freeMode, next]);

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

      {/* Character display (kana mode) */}
      {!freeMode && current && (
        <div className="flex items-center justify-between">
          <div
            className="text-5xl font-bold text-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {current.character}
          </div>
          <div className="text-right">
            {showRomajiHint && (
              <p className="text-sm text-muted-foreground">{current.romaji}</p>
            )}
            {practiceCount > 0 && (
              <p className="text-xs text-muted-foreground">praticado {practiceCount}×</p>
            )}
          </div>
        </div>
      )}

      {/* Teste de desenho */}
      {activeChar && <DrawingCanvas strokes={strokes} />}

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
