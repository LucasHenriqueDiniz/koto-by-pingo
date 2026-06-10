import { useEffect, useState } from 'react';
import { vocabulary, categories } from '../data/vocabulary';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';
import { VocabularyQuiz } from '../components/vocabulary/VocabularyQuiz';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { shuffle } from '../utils/scoring';
import type { VocabularyWord } from '../types/vocabulary';

type Mode = 'flashcards' | 'quiz';

const categoryLabels: Record<string, string> = {
  saudações: 'Saudações',
  números: 'Números',
  família: 'Família',
  comida: 'Comida',
  cores: 'Cores',
  tempo: 'Tempo',
  lugares: 'Lugares',
  verbos: 'Verbos',
  adjetivos: 'Adjetivos',
};

export function VocabularyPage() {
  const [mode, setMode] = useState<Mode>('flashcards');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [cardIndex, setCardIndex] = useState(0);
  const [queue, setQueue] = useState<VocabularyWord[]>(() => shuffle(vocabulary));

  useEffect(() => {
    updatePageSEO('Vocabulário N5', 'Estude vocabulário JLPT N5 com flashcards e quiz de múltipla escolha em português.');
  }, []);

  useEffect(() => {
    const filtered = selectedCategory === 'todos'
      ? [...vocabulary]
      : vocabulary.filter(w => w.category === selectedCategory);
    setQueue(shuffle(filtered));
    setCardIndex(0);
  }, [selectedCategory]);

  const currentWord = queue[cardIndex % queue.length];

  return (
    <div>
      <PageHeader
        title="Vocabulário"
        description="Aprenda palavras do nível N5 com flashcards e quiz."
        color="#7C3AED"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-sm mx-auto space-y-5">
          {/* Mode tabs */}
          <div className="flex bg-muted rounded-xl p-1 gap-1">
            {(['flashcards', 'quiz'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`vocab-mode-${m}`}
              >
                {m === 'flashcards' ? 'Flashcards' : 'Quiz'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2" data-testid="vocab-categories">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === 'todos'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              data-testid="vocab-category-todos"
            >
              Todos ({vocabulary.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                style={selectedCategory === cat ? { backgroundColor: '#7C3AED' } : {}}
                data-testid={`vocab-category-${cat}`}
              >
                {categoryLabels[cat] ?? cat}
              </button>
            ))}
          </div>

          {/* Content */}
          {queue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma palavra encontrada.</p>
          ) : mode === 'flashcards' && currentWord ? (
            <VocabularyCard
              word={currentWord}
              onNext={() => setCardIndex(i => i + 1)}
            />
          ) : (
            <VocabularyQuiz words={queue} />
          )}
        </div>

        <div className="mt-10">
          <AdPlaceholder slot="banner" />
        </div>
      </div>
    </div>
  );
}
