import type { VocabularyWord } from '../../types/vocabulary';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { speakJapanese } from '../../utils/japaneseAudio';

interface WordListCardProps {
  word: VocabularyWord;
  /** Nível de domínio 0–5 (derivado do progresso real). */
  mastery: number;
  categoryLabel: string;
}

export function WordListCard({ word, mastery, categoryLabel }: WordListCardProps) {
  const handleSpeak = () => speakJapanese(word.kana, 0.85, () => {}, () => {});

  return (
    <div className="bg-card border border-card-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-center gap-5 min-w-0">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border border-border flex-shrink-0">
          <span className="text-2xl font-bold text-foreground font-japanese">{word.japanese}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-base text-primary font-japanese">{word.kana}</span>
            <span className="text-[--color-text-secondary] opacity-40">•</span>
            <span className="text-sm text-[--color-text-secondary] italic">{word.romaji}</span>
          </div>
          <h4 className="font-heading text-lg font-bold text-foreground truncate">{word.meaningPt}</h4>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 bg-[hsl(var(--tertiary))]/15 text-[hsl(var(--tertiary))] rounded text-xs font-medium">{categoryLabel}</span>
            <span className="px-2 py-0.5 bg-muted text-[--color-text-secondary] rounded text-xs font-medium">{word.level}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-xs text-[--color-text-secondary] uppercase mb-1">Domínio</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i < mastery ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={handleSpeak}
          aria-label={`Ouvir ${word.kana}`}
          className="p-3 text-[--color-text-secondary] hover:text-primary hover:bg-accent transition-colors rounded-full"
        >
          <MaterialIcon name="volume_up" size={22} />
        </button>
      </div>
    </div>
  );
}
