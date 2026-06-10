import { useEffect, useState, useCallback } from 'react';
import { vocabulary, categories } from '../data/vocabulary';
import type { VocabularyTrainingMode, VocabularyWord } from '../types/vocabulary';
import { FlashcardMode } from '../components/vocabulary/FlashcardMode';
import { WordSelectionMode } from '../components/vocabulary/WordSelectionMode';
import { MatchingPairsMode } from '../components/vocabulary/MatchingPairsMode';
import { TranslationQuizMode } from '../components/vocabulary/TranslationQuizMode';
import { RightStudyPanel } from '../components/layout/RightStudyPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { shuffle } from '../utils/scoring';
import {
  getWeakWords,
  getNeverSeenWords,
  getMasteredWords,
  getVocabStats,
} from '../services/progress/progress.local';
import { useLocalStorage } from '../hooks/useLocalStorage';

type FilterType = 'todos' | 'neverSeen' | 'weak' | 'mastered';

const modeConfig: { value: VocabularyTrainingMode; label: string; desc: string }[] = [
  { value: 'flashcards', label: 'Flashcards', desc: 'Vire o card e avalie' },
  { value: 'word_selection', label: 'Seleção', desc: 'Escolha a leitura correta' },
  { value: 'matching_pairs', label: 'Pares', desc: 'Combine os pares' },
  { value: 'translation_quiz', label: 'Quiz', desc: 'Escolha o significado' },
];

const categoryLabels: Record<string, string> = {
  saudações: 'Saudações', números: 'Números', família: 'Família',
  comida: 'Comida', cores: 'Cores', tempo: 'Tempo',
  lugares: 'Lugares', verbos: 'Verbos', adjetivos: 'Adjetivos',
};

function getFilteredWords(
  filter: FilterType,
  category: string,
): VocabularyWord[] {
  const weakIds = new Set(getWeakWords(100));
  const neverIds = new Set(getNeverSeenWords());
  const masteredIds = new Set(getMasteredWords());

  let base = [...vocabulary];

  // Category filter
  if (category !== 'todos') {
    base = base.filter(w => w.category === category);
  }

  // Smart filter
  if (filter === 'weak') base = base.filter(w => weakIds.has(w.id));
  else if (filter === 'neverSeen') base = base.filter(w => neverIds.has(w.id));
  else if (filter === 'mastered') base = base.filter(w => masteredIds.has(w.id));

  // Need at least 4 for quiz modes
  if (base.length < 4 && (filter !== 'todos')) {
    return shuffle([...vocabulary]).slice(0, Math.max(base.length, 8));
  }
  return base.length > 0 ? base : vocabulary;
}

export function VocabularyPage() {
  const [mode, setMode] = useLocalStorage<VocabularyTrainingMode>('vocab_mode', 'flashcards');
  const [category, setCategory] = useState('todos');
  const [filter, setFilter] = useState<FilterType>('todos');
  const [showTranslationHint, setShowTranslationHint] = useLocalStorage('vocab_hint', true);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    updatePageSEO('Vocabulário N5', 'Estude vocabulário japonês N5 com flashcards, seleção de leitura, combinação de pares e quiz de tradução.');
  }, []);

  const words = getFilteredWords(filter, category);
  const stats = getVocabStats();

  const handleModeChange = useCallback((m: VocabularyTrainingMode) => {
    setMode(m);
    setSessionCorrect(0);
    setSessionTotal(0);
    setRenderKey(k => k + 1);
  }, [setMode]);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setSessionCorrect(0);
    setSessionTotal(0);
    setRenderKey(k => k + 1);
  }, []);

  const handleFilterChange = useCallback((f: FilterType) => {
    setFilter(f);
    setSessionCorrect(0);
    setSessionTotal(0);
    setRenderKey(k => k + 1);
  }, []);

  const handleAttempt = useCallback((correct: boolean) => {
    setSessionTotal(t => t + 1);
    if (correct) setSessionCorrect(c => c + 1);
  }, []);

  const renderMode = () => {
    const shared = { words, onAttempt: handleAttempt };
    switch (mode) {
      case 'flashcards':
        return <FlashcardMode key={renderKey} {...shared} />;
      case 'word_selection':
        return <WordSelectionMode key={renderKey} {...shared} showTranslationHint={showTranslationHint} />;
      case 'matching_pairs':
        return <MatchingPairsMode key={renderKey} {...shared} />;
      case 'translation_quiz':
        return <TranslationQuizMode key={renderKey} {...shared} />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Vocabulário"
        description="Treine palavras N5 com quatro modos de estudo."
        color="#7C3AED"
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Ad before session */}
        <div className="mb-6">
          <AdPlaceholder slot="banner" />
        </div>

        <div className="flex gap-6 items-start">
          {/* Main training area */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Mode selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="vocab-mode-tabs">
              {modeConfig.map(m => (
                <button
                  key={m.value}
                  onClick={() => handleModeChange(m.value)}
                  className={`rounded-xl px-3 py-2.5 text-left transition-all border-2 ${
                    mode === m.value
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                  data-testid={`vocab-mode-${m.value}`}
                >
                  <p className={`text-sm font-semibold ${mode === m.value ? 'text-primary' : 'text-foreground'}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Smart filters */}
              <div className="flex gap-1.5 flex-wrap">
                {([
                  { value: 'todos', label: `Todas (${vocabulary.length})` },
                  { value: 'neverSeen', label: `Novas (${stats.neverSeen})` },
                  { value: 'weak', label: `Difíceis (${stats.weak})` },
                  { value: 'mastered', label: `Dominadas (${stats.mastered})` },
                ] as { value: FilterType; label: string }[]).map(f => (
                  <button
                    key={f.value}
                    onClick={() => handleFilterChange(f.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filter === f.value
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid={`vocab-filter-${f.value}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5" data-testid="vocab-categories">
              <button
                onClick={() => handleCategoryChange('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === 'todos'
                    ? 'text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                style={category === 'todos' ? { backgroundColor: '#7C3AED' } : {}}
                data-testid="vocab-category-todos"
              >
                Todas as categorias
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat
                      ? 'text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  style={category === cat ? { backgroundColor: '#7C3AED' } : {}}
                  data-testid={`vocab-category-${cat}`}
                >
                  {categoryLabels[cat] ?? cat}
                </button>
              ))}
            </div>

            {/* Word Selection hint toggle */}
            {mode === 'word_selection' && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-sm" htmlFor="hint-toggle">
                  <span className="text-foreground font-medium">Mostrar tradução como dica</span>
                  <button
                    id="hint-toggle"
                    role="switch"
                    aria-checked={showTranslationHint}
                    onClick={() => setShowTranslationHint(v => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showTranslationHint ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    data-testid="hint-toggle"
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showTranslationHint ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            )}

            {/* Empty state */}
            {words.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nenhuma palavra encontrada para este filtro.
              </div>
            ) : (
              /* Training mode */
              <div className="max-w-md mx-auto xl:max-w-none">
                {renderMode()}
              </div>
            )}
          </div>

          {/* Right panel (xl+) */}
          <RightStudyPanel
            mode={mode}
            category={category}
            correct={sessionCorrect}
            total={sessionTotal}
            weakCount={stats.weak}
            hint={
              mode === 'word_selection'
                ? 'Dica: tente desativar a tradução para um treino mais desafiador.'
                : mode === 'matching_pairs'
                ? 'Clique em uma palavra à esquerda e depois no par à direita.'
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
