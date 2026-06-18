import { useState, useCallback, useEffect } from 'react';
import type { KanaItem } from '../../../types/kana';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { recordTracingPractice, getTracingPracticeMap } from '../../../services/progress/progress.local';
import { KanaStrokeViewer } from '../KanaStrokeViewer';
import { DrawingCanvas } from '../DrawingCanvas';
import { fetchStrokes } from '../../../data/strokeData';

interface TracingModeProps {
  items: KanaItem[];
  showRomajiHint?: boolean;
}

type Tab = 'order' | 'practice';

export function TracingMode({ items, showRomajiHint }: TracingModeProps) {
  const { current, next } = useKanaQueue(items);
  const [practiceMap, setPracticeMap] = useState(() => getTracingPracticeMap());
  const [tab, setTab] = useState<Tab>('order');
  const [strokes, setStrokes] = useState<string[]>([]);

  // Free-practice (any kanji)
  const [freeChar, setFreeChar] = useState('');
  const [freeMode, setFreeMode] = useState(false);

  const activeChar = freeMode ? freeChar : (current?.character ?? '');

  // Load strokes for the drawing canvas guide
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
            Digite um caractere (kanji, hiragana ou katakana) para ver a ordem dos traços e praticar o desenho.
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

      {/* Tabs */}
      {activeChar && (
        <>
          <div className="flex rounded-xl bg-muted/40 p-1 gap-1">
            <button
              onClick={() => setTab('order')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'order'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Ordem dos traços
            </button>
            <button
              onClick={() => setTab('practice')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'practice'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Praticar desenho
            </button>
          </div>

          {tab === 'order' && <KanaStrokeViewer character={activeChar} />}
          {tab === 'practice' && <DrawingCanvas strokes={strokes} />}
        </>
      )}

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
