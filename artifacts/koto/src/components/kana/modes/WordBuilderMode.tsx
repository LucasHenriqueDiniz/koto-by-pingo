import { useState, useCallback, useEffect, useMemo } from 'react';
import type { KanaItem } from '../../../types/kana';
import { kanaWords, type KanaWord } from '../../../data/kanaWords';
import { hiragana } from '../../../data/kana';
import { shuffle } from '../../../utils/scoring';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../KanaStats';

interface WordBuilderModeProps {
  items: KanaItem[];
}

interface BlockItem {
  uid: string;
  kanaId: string;
  character: string;
}

function buildBlocks(word: KanaWord): BlockItem[] {
  const correctBlocks: BlockItem[] = word.kanaIds.map((id, i) => {
    const kana = hiragana.find(k => k.id === id);
    return { uid: `${id}-${i}`, kanaId: id, character: kana?.character ?? '' };
  });

  const usedIds = new Set(word.kanaIds);
  const distractorPool = shuffle(hiragana.filter(k => !usedIds.has(k.id)));
  const distractorCount = Math.min(2, Math.max(0, 8 - correctBlocks.length));
  const distractors: BlockItem[] = distractorPool.slice(0, distractorCount).map((k, i) => ({
    uid: `d-${k.id}-${i}`,
    kanaId: k.id,
    character: k.character,
  }));

  return shuffle([...correctBlocks, ...distractors]);
}

export function WordBuilderMode({ items }: WordBuilderModeProps) {
  const ids = useMemo(() => new Set(items.map(k => k.id.replace(/^k-/, 'h-'))), [items]);
  const availableWords = useMemo(() => {
    const filtered = kanaWords.filter(w => w.kanaIds.every(id => ids.has(id)));
    return filtered.length > 0 ? filtered : kanaWords;
  }, [ids]);

  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue<KanaWord>(availableWords);

  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [selected, setSelected] = useState<BlockItem[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  useEffect(() => () => endSession(), [endSession]);

  useEffect(() => {
    if (current) {
      setBlocks(buildBlocks(current));
      setSelected([]);
      setFeedback('idle');
    }
  }, [current]);

  const handleBlockClick = useCallback((block: BlockItem) => {
    if (feedback !== 'idle') return;
    setSelected(prev => [...prev, block]);
    setBlocks(prev => prev.filter(b => b.uid !== block.uid));
  }, [feedback]);

  const handleRemoveSelected = useCallback((block: BlockItem) => {
    if (feedback !== 'idle') return;
    setSelected(prev => prev.filter(b => b.uid !== block.uid));
    setBlocks(prev => [...prev, block]);
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (!current || selected.length !== current.kanaIds.length) return;
    const isCorrect = selected.every((b, i) => b.kanaId === current.kanaIds[i]);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    for (const kanaId of current.kanaIds) {
      const kana = hiragana.find(k => k.id === kanaId);
      if (kana) recordKanaAttempt(kana.id, isCorrect, { mode: 'word_builder', group: kana.group });
    }
    registerResult(isCorrect);
  }, [current, selected, registerResult]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhuma palavra disponível para este filtro.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <p className="text-sm text-muted-foreground text-center">
        Monte a palavra: <strong className="text-foreground">{current.meaningPt}</strong>
      </p>

      <div className="flex gap-2 justify-center flex-wrap min-h-16" data-testid="kana-word-builder-slots">
        {Array.from({ length: current.kanaIds.length }).map((_, i) => {
          const block = selected[i];
          return (
            <button
              key={i}
              onClick={() => block && handleRemoveSelected(block)}
              disabled={!block || feedback !== 'idle'}
              className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border bg-card text-2xl"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              data-testid={`kana-word-builder-slot-${i}`}
            >
              {block?.character ?? ''}
            </button>
          );
        })}
      </div>

      {feedback !== 'idle' && (
        <p className="text-sm font-medium text-center" style={{ color: feedback === 'correct' ? '#2F9E44' : '#E5484D' }}>
          {feedback === 'correct'
            ? 'Correto!'
            : `Quase. A resposta era ${current.word} (${current.romaji}).`}
        </p>
      )}

      <div className="flex gap-2 flex-wrap justify-center" data-testid="kana-word-builder-blocks">
        {blocks.map(block => (
          <button
            key={block.uid}
            onClick={() => handleBlockClick(block)}
            disabled={feedback !== 'idle'}
            className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border bg-muted text-2xl hover:bg-accent transition-colors"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            data-testid={`kana-word-builder-block-${block.uid}`}
          >
            {block.character}
          </button>
        ))}
      </div>

      {feedback === 'idle' ? (
        <button
          onClick={handleCheck}
          disabled={selected.length !== current.kanaIds.length}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40"
          data-testid="kana-word-builder-check-btn"
        >
          Verificar
        </button>
      ) : (
        <button
          onClick={next}
          autoFocus
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kana-word-builder-next-btn"
        >
          Próxima palavra
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
