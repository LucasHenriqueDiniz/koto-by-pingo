import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';
import { recordWordAttempt } from '../../services/progress/progress.local';
import { shuffle } from '../../utils/scoring';

interface FlashcardModeProps {
  words: VocabularyWord[];
  onAttempt?: (correct: boolean) => void;
}

export function FlashcardMode({ words, onAttempt }: FlashcardModeProps) {
  const [queue] = useState(() => shuffle([...words]));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const current = queue[index % queue.length];

  const handleResult = useCallback((isCorrect: boolean) => {
    recordWordAttempt({
      wordId: current.id,
      correct: isCorrect,
      weakReason: isCorrect ? undefined : 'meaning',
      mode: 'flashcards',
    });
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
    onAttempt?.(isCorrect);
    setFlipped(false);
    setTimeout(() => setIndex(i => i + 1), 100);
  }, [current, onAttempt]);

  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Stats */}
      {total > 0 && (
        <div className="text-sm text-center text-muted-foreground">
          Acertos: <strong className="text-foreground">{correct}/{total}</strong>
          {' — '}
          Precisão: <strong className="text-foreground">{Math.round((correct / total) * 100)}%</strong>
        </div>
      )}

      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
        data-testid="flashcard"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative' }}
        >
          {/* Front */}
          <div
            className="w-full h-52 flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card shadow-sm px-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span
              className="text-5xl font-medium select-none"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              data-testid="flashcard-japanese"
            >
              {current.japanese}
            </span>
            {current.japanese !== current.kana && (
              <span
                className="text-lg text-muted-foreground mt-2 select-none"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {current.kana}
              </span>
            )}
            <p className="text-xs text-muted-foreground mt-4">Clique para revelar</p>
          </div>

          {/* Back */}
          <div
            className="w-full h-52 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-accent shadow-sm px-6 absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-2xl font-semibold text-foreground text-center mb-2" data-testid="flashcard-meaning">
              {current.meaningPt}
            </span>
            <span className="text-sm text-muted-foreground font-mono">{current.romaji}</span>
            <span className="text-xs text-muted-foreground mt-1">{current.category} · {current.level}</span>
          </div>
        </motion.div>
      </div>

      {/* Result buttons (only when flipped) */}
      {flipped ? (
        <div className="flex gap-2 w-full">
          <button
            onClick={() => handleResult(false)}
            className="flex-1 py-3 rounded-xl border-2 border-[#E5484D] text-[#B4232A] bg-[#FFE5E7] text-sm font-semibold"
            data-testid="flashcard-wrong-btn"
          >
            Errei
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex-1 py-3 rounded-xl border-2 border-[#2F9E44] text-[#166534] bg-[#DCFCE7] text-sm font-semibold"
            data-testid="flashcard-correct-btn"
          >
            Acertei
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="flashcard-reveal-btn"
        >
          Ver resposta
        </button>
      )}
    </div>
  );
}
