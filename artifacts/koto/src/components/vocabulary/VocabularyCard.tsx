import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VocabularyWord } from '../../types/vocabulary';

interface VocabularyCardProps {
  word: VocabularyWord;
  onNext?: () => void;
}

export function VocabularyCard({ word, onNext }: VocabularyCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(f => !f);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => onNext?.(), 150);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        data-testid="vocabulary-card"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative' }}
          className="w-full"
        >
          {/* Front */}
          <div
            className="w-full h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card shadow-sm px-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span
              className="text-5xl font-medium select-none"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              data-testid="vocab-japanese"
            >
              {word.japanese}
            </span>
            {word.japanese !== word.kana && (
              <span
                className="text-lg text-muted-foreground mt-2 select-none"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {word.kana}
              </span>
            )}
            <p className="text-xs text-muted-foreground mt-4">Clique para revelar</p>
          </div>

          {/* Back */}
          <div
            className="w-full h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-accent shadow-sm px-6 absolute inset-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-2xl font-semibold text-foreground text-center" data-testid="vocab-meaning">
              {word.meaningPt}
            </span>
            <span className="text-sm text-muted-foreground mt-2">{word.romaji}</span>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={handleFlip}
          className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          data-testid="vocab-flip-btn"
        >
          {flipped ? 'Ver frente' : 'Ver tradução'}
        </button>
        {onNext && (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            data-testid="vocab-next-btn"
          >
            Próxima
          </button>
        )}
      </div>
    </div>
  );
}
