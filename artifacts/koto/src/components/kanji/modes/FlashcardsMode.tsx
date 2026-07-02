import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { KanjiItem } from '../../../types/kanji';
import { recordKanjiAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../../kana/KanaStats';

interface FlashcardsModeProps {
  items: KanjiItem[];
}

const FLIP_DURATION_MS = 350;

export function FlashcardsMode({ items }: FlashcardsModeProps) {
  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue(items);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => () => endSession('kanji'), [endSession]);

  const handleResult = useCallback((correct: boolean) => {
    if (!current) return;
    recordKanjiAttempt(current.id, correct, { mode: 'flashcards', jlptLevel: current.jlptLevel });
    registerResult(correct);
    setAnswered(true);
  }, [current, registerResult]);

  const handleNext = useCallback(() => {
    setFlipped(false);
    setAnswered(false);
    setTimeout(next, FLIP_DURATION_MS);
  }, [next]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum kanji disponível para este filtro.
      </div>
    );
  }

  const example = current.examples?.[0];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => { if (!answered) setFlipped(f => !f); }}
        data-testid="kanji-flashcard"
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
              className="text-7xl font-medium select-none"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              data-testid="kanji-flashcard-character"
            >
              {current.character}
            </span>
            <p className="text-xs text-muted-foreground mt-4">Clique para revelar</p>
          </div>

          {/* Back */}
          <div
            className="w-full h-52 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-accent shadow-sm px-6 absolute inset-0 text-center gap-1"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-2xl font-bold text-foreground" data-testid="kanji-flashcard-meaning">
              {current.meaningPt}
            </span>
            <p className="text-sm text-muted-foreground font-mono">
              {current.onyomi.length > 0 && <>on: {current.onyomi.join(', ')}</>}
              {current.onyomi.length > 0 && current.kunyomi.length > 0 && ' · '}
              {current.kunyomi.length > 0 && <>kun: {current.kunyomi.join(', ')}</>}
            </p>
            {example && (
              <p className="text-sm text-muted-foreground mt-2">
                <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{example.japanese}</span>
                {' '}({example.reading}) — {example.meaningPt}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {answered ? (
        <button
          onClick={handleNext}
          autoFocus
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kanji-flashcard-next-btn"
        >
          Próximo
        </button>
      ) : flipped ? (
        <div className="flex gap-2 w-full">
          <button
            onClick={() => handleResult(false)}
            className="flex-1 py-3 rounded-xl border-2 border-[#E5484D] text-[#B4232A] bg-[#FFE5E7] text-sm font-semibold"
            data-testid="kanji-flashcard-wrong-btn"
          >
            Errei
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex-1 py-3 rounded-xl border-2 border-[#2F9E44] text-[#166534] bg-[#DCFCE7] text-sm font-semibold"
            data-testid="kanji-flashcard-correct-btn"
          >
            Acertei
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kanji-flashcard-reveal-btn"
        >
          Ver resposta
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
