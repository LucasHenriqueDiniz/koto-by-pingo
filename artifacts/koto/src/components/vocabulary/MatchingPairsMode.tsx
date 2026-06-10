import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';
import { shuffle } from '../../utils/scoring';
import { recordWordAttempt } from '../../services/progress/progress.local';

type PairMode = 'reading' | 'meaning' | 'reading_and_meaning';

interface MatchingPairsModeProps {
  words: VocabularyWord[];
  pairMode?: PairMode;
  onAttempt?: (correct: boolean) => void;
}

type PairState = 'idle' | 'selected' | 'correct' | 'wrong';

interface PairItem {
  wordId: string;
  displayText: string;
  state: PairState;
}

const BATCH_SIZE = 6;

function buildBatch(words: VocabularyWord[], pairMode: PairMode): { left: PairItem[]; right: PairItem[] } {
  const batch = shuffle([...words]).slice(0, BATCH_SIZE);
  const left: PairItem[] = batch.map(w => ({
    wordId: w.id,
    displayText: w.japanese,
    state: 'idle',
  }));
  const right: PairItem[] = shuffle(batch.map(w => ({
    wordId: w.id,
    displayText: pairMode === 'reading'
      ? w.romaji
      : pairMode === 'meaning'
      ? w.meaningPt
      : `${w.romaji} — ${w.meaningPt}`,
    state: 'idle' as PairState,
  })));
  return { left, right };
}

export function MatchingPairsMode({ words, pairMode = 'reading_and_meaning', onAttempt }: MatchingPairsModeProps) {
  const [batch, setBatch] = useState(() => buildBatch(words, pairMode));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [batchDone, setBatchDone] = useState(false);

  const matched = batch.left.filter(i => i.state === 'correct').length;

  const handleLeftClick = useCallback((wordId: string) => {
    const item = batch.left.find(i => i.wordId === wordId);
    if (!item || item.state === 'correct') return;
    setSelectedLeft(prev => prev === wordId ? null : wordId);
  }, [batch]);

  const handleRightClick = useCallback((wordId: string) => {
    if (!selectedLeft) return;
    const rightItem = batch.right.find(i => i.wordId === wordId);
    if (!rightItem || rightItem.state === 'correct') return;

    const isCorrect = selectedLeft === wordId;
    recordWordAttempt({
      wordId: selectedLeft,
      correct: isCorrect,
      weakReason: isCorrect ? undefined : 'reading',
      mode: 'matching_pairs',
    });
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
    onAttempt?.(isCorrect);

    if (isCorrect) {
      setBatch(prev => ({
        left: prev.left.map(i => i.wordId === selectedLeft ? { ...i, state: 'correct' } : i),
        right: prev.right.map(i => i.wordId === wordId ? { ...i, state: 'correct' } : i),
      }));
      setSelectedLeft(null);
      // Check if batch is complete
      const newMatched = batch.left.filter(i => i.state === 'correct').length + 1;
      if (newMatched >= batch.left.length) {
        setBatchDone(true);
      }
    } else {
      // Flash wrong on both items briefly
      setBatch(prev => ({
        left: prev.left.map(i => i.wordId === selectedLeft ? { ...i, state: 'wrong' } : i),
        right: prev.right.map(i => i.wordId === wordId ? { ...i, state: 'wrong' } : i),
      }));
      setTimeout(() => {
        setBatch(prev => ({
          left: prev.left.map(i => i.wordId === selectedLeft ? { ...i, state: 'idle' } : i),
          right: prev.right.map(i => i.wordId === wordId ? { ...i, state: 'idle' } : i),
        }));
        setSelectedLeft(null);
      }, 600);
    }
  }, [selectedLeft, batch, onAttempt]);

  const handleNewBatch = useCallback(() => {
    setBatch(buildBatch(words, pairMode));
    setBatchDone(false);
    setSelectedLeft(null);
  }, [words, pairMode]);

  const getItemStyle = (item: PairItem, isLeft: boolean): string => {
    const isSelected = isLeft && item.wordId === selectedLeft;
    if (item.state === 'correct') return 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534] opacity-60 cursor-default';
    if (item.state === 'wrong') return 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
    if (isSelected) return 'border-primary bg-accent text-foreground';
    return 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
  };

  if (batchDone) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {BATCH_SIZE}/{BATCH_SIZE}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Pares formados neste round</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Sessão: {correct}/{total} correto{total !== 1 ? 's' : ''}
        </div>
        <button
          onClick={handleNewBatch}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          data-testid="matching-pairs-next-batch-btn"
        >
          Novo round
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Stats */}
      {total > 0 && (
        <div className="text-sm text-center text-muted-foreground">
          {matched}/{batch.left.length} pares encontrados
          {' — '}
          Acertos: <strong className="text-foreground">{correct}/{total}</strong>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Clique em uma palavra japonesa, depois no par correspondente.
      </p>

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-3" data-testid="matching-pairs-grid">
        {/* Left column */}
        <div className="flex flex-col gap-2">
          {batch.left.map(item => (
            <motion.button
              key={item.wordId}
              onClick={() => handleLeftClick(item.wordId)}
              disabled={item.state === 'correct'}
              whileTap={item.state !== 'correct' ? { scale: 0.97 } : {}}
              className={`border-2 rounded-xl px-3 py-3 text-center transition-all text-sm font-medium ${getItemStyle(item, true)}`}
              style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.1rem' }}
              data-testid={`matching-left-${item.wordId}`}
            >
              {item.displayText}
            </motion.button>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2">
          {batch.right.map(item => (
            <motion.button
              key={item.wordId + '-right'}
              onClick={() => handleRightClick(item.wordId)}
              disabled={item.state === 'correct'}
              whileTap={item.state !== 'correct' ? { scale: 0.97 } : {}}
              className={`border-2 rounded-xl px-3 py-3 text-center transition-all text-xs font-medium leading-tight ${getItemStyle(item, false)}`}
              data-testid={`matching-right-${item.wordId}`}
            >
              {item.displayText}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
