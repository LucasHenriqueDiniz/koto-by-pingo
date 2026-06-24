import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { KanaItem } from '../../../types/kana';
import { shuffle } from '../../../utils/scoring';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { MaterialIcon } from '../../ui/MaterialIcon';

const PAIR_COLORS = ['#0284C7', '#AC2B2F', '#7C3AED', '#0D9488', '#C2410C', '#65A30D'];

interface MatchingPairsModeProps {
  items: KanaItem[];
}

type PairState = 'idle' | 'selected' | 'correct' | 'wrong';

interface PairItem {
  kanaId: string;
  displayText: string;
  state: PairState;
}

const BATCH_SIZE = 6;

function buildBatch(items: KanaItem[], size: number): { left: PairItem[]; right: PairItem[] } {
  const batch = shuffle([...items]).slice(0, size);
  const left: PairItem[] = batch.map(k => ({ kanaId: k.id, displayText: k.character, state: 'idle' }));
  const right: PairItem[] = shuffle(batch.map(k => ({ kanaId: k.id, displayText: k.romaji, state: 'idle' as PairState })));
  return { left, right };
}

export function MatchingPairsMode({ items }: MatchingPairsModeProps) {
  const size = Math.min(BATCH_SIZE, items.length);
  const [batch, setBatch] = useState(() => buildBatch(items, size));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [batchDone, setBatchDone] = useState(false);
  const [matchColor, setMatchColor] = useState<Record<string, string>>({});

  const itemMap = useMemo(() => new Map(items.map(k => [k.id, k])), [items]);

  const matched = batch.left.filter(i => i.state === 'correct').length;

  const handleLeftClick = useCallback((kanaId: string) => {
    const item = batch.left.find(i => i.kanaId === kanaId);
    if (!item || item.state === 'correct') return;
    setSelectedLeft(prev => prev === kanaId ? null : kanaId);
  }, [batch]);

  const handleRightClick = useCallback((kanaId: string) => {
    if (!selectedLeft) return;
    const rightItem = batch.right.find(i => i.kanaId === kanaId);
    if (!rightItem || rightItem.state === 'correct') return;

    const isCorrect = selectedLeft === kanaId;
    const sourceKana = itemMap.get(selectedLeft);
    if (sourceKana) {
      recordKanaAttempt(sourceKana.id, isCorrect, { mode: 'matching_pairs', group: sourceKana.group });
    }
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);

    if (isCorrect) {
      setBatch(prev => ({
        left: prev.left.map(i => i.kanaId === selectedLeft ? { ...i, state: 'correct' } : i),
        right: prev.right.map(i => i.kanaId === kanaId ? { ...i, state: 'correct' } : i),
      }));
      setMatchColor(prev => ({ ...prev, [selectedLeft]: PAIR_COLORS[Object.keys(prev).length % PAIR_COLORS.length] }));
      setSelectedLeft(null);
      const newMatched = batch.left.filter(i => i.state === 'correct').length + 1;
      if (newMatched >= batch.left.length) {
        setBatchDone(true);
      }
    } else {
      setBatch(prev => ({
        left: prev.left.map(i => i.kanaId === selectedLeft ? { ...i, state: 'wrong' } : i),
        right: prev.right.map(i => i.kanaId === kanaId ? { ...i, state: 'wrong' } : i),
      }));
      setTimeout(() => {
        setBatch(prev => ({
          left: prev.left.map(i => i.kanaId === selectedLeft ? { ...i, state: 'idle' } : i),
          right: prev.right.map(i => i.kanaId === kanaId ? { ...i, state: 'idle' } : i),
        }));
        setSelectedLeft(null);
      }, 600);
    }
  }, [selectedLeft, batch, itemMap]);

  const handleNewBatch = useCallback(() => {
    setBatch(buildBatch(items, size));
    setBatchDone(false);
    setSelectedLeft(null);
    setMatchColor({});
  }, [items, size]);

  const getItemStyle = (item: PairItem, isLeft: boolean): string => {
    const isSelected = isLeft && item.kanaId === selectedLeft;
    if (item.state === 'correct') return 'border-transparent bg-card/60 text-muted-foreground opacity-70 cursor-default';
    if (item.state === 'wrong') return 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
    if (isSelected) return 'border-primary bg-accent text-foreground shadow-sm';
    return 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted cursor-pointer';
  };

  if (size < 2) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Selecione pelo menos 2 caracteres para jogar este modo.
      </div>
    );
  }

  if (batchDone) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {batch.left.length}/{batch.left.length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Pares formados neste round</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Sessão: {correct}/{total} correto{total !== 1 ? 's' : ''}
        </div>
        <button
          onClick={handleNewBatch}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          data-testid="kana-matching-next-batch-btn"
        >
          Novo round
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Clique em um kana, depois no romaji correspondente.
        </p>
        {total > 0 && (
          <p className="text-xs text-muted-foreground">
            {matched}/{batch.left.length} pares · <strong className="text-foreground">{correct}/{total}</strong> acertos
          </p>
        )}
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${(matched / batch.left.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3" data-testid="kana-matching-grid">
        <div className="flex flex-col gap-2">
          {batch.left.map(item => (
            <motion.button
              key={item.kanaId}
              onClick={() => handleLeftClick(item.kanaId)}
              disabled={item.state === 'correct'}
              whileTap={item.state !== 'correct' ? { scale: 0.97 } : {}}
              animate={item.state === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              className={`relative border-2 rounded-xl px-3 py-3 text-center transition-all text-2xl font-medium shadow-sm ${getItemStyle(item, true)}`}
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              data-testid={`kana-matching-left-${item.kanaId}`}
            >
              {item.state === 'correct' && matchColor[item.kanaId] && (
                <span
                  className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center"
                  style={{ backgroundColor: matchColor[item.kanaId] }}
                >
                  <MaterialIcon name="check" size={10} className="text-white" />
                </span>
              )}
              {item.displayText}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {batch.right.map(item => (
            <motion.button
              key={item.kanaId + '-right'}
              onClick={() => handleRightClick(item.kanaId)}
              disabled={item.state === 'correct'}
              whileTap={item.state !== 'correct' ? { scale: 0.97 } : {}}
              animate={item.state === 'wrong' ? { x: [0, 6, -6, 4, -4, 0] } : {}}
              className={`relative border-2 rounded-xl px-3 py-3 text-center transition-all text-sm font-mono font-medium shadow-sm ${getItemStyle(item, false)}`}
              data-testid={`kana-matching-right-${item.kanaId}`}
            >
              {item.state === 'correct' && matchColor[item.kanaId] && (
                <span
                  className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center"
                  style={{ backgroundColor: matchColor[item.kanaId] }}
                >
                  <MaterialIcon name="check" size={10} className="text-white" />
                </span>
              )}
              {item.displayText}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
