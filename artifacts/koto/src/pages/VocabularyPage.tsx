import { useEffect, useState, useCallback } from 'react';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { vocabulary, categories } from '../data/vocabulary';
import type { VocabularyTrainingMode, VocabularyWord } from '../types/vocabulary';
import { FlashcardMode } from '../components/vocabulary/FlashcardMode';
import { WordSelectionMode } from '../components/vocabulary/WordSelectionMode';
import { MatchingPairsMode } from '../components/vocabulary/MatchingPairsMode';
import { TranslationQuizMode } from '../components/vocabulary/TranslationQuizMode';
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
import { useRegisterActiveSession } from '../contexts/ActiveSessionContext';

type FilterType = 'todos' | 'neverSeen' | 'weak' | 'mastered';

interface ModeMeta {
  value: VocabularyTrainingMode;
  title: string;
  desc: string;
  icon: MaterialIconName;
  tag: string;
}

const MODE_CARDS: ModeMeta[] = [
  { value: 'flashcards', title: 'Flashcards', desc: 'Vire o card e avalie sua memória.', icon: 'style', tag: 'Clássico' },
  { value: 'translation_quiz', title: 'Múltipla escolha', desc: 'Escolha o significado correto entre 4 opções.', icon: 'quiz', tag: 'Rápido' },
  { value: 'matching_pairs', title: 'Ligar pares', desc: 'Combine cada palavra ao seu significado.', icon: 'join_inner', tag: 'Memória' },
  { value: 'word_selection', title: 'Seleção de leitura', desc: 'Escolha a leitura correta da palavra.', icon: 'spellcheck', tag: 'Leitura' },
];

const categoryLabels: Record<string, string> = {
  saudações: 'Saudações', números: 'Números', família: 'Família',
  comida: 'Comida', cores: 'Cores', tempo: 'Tempo',
  lugares: 'Lugares', verbos: 'Verbos', adjetivos: 'Adjetivos',
};

function getFilteredWords(filter: FilterType, category: string): VocabularyWord[] {
  const weakIds = new Set(getWeakWords(100));
  const neverIds = new Set(getNeverSeenWords());
  const masteredIds = new Set(getMasteredWords());

  let base = [...vocabulary];
  if (category !== 'todos') base = base.filter(w => w.category === category);
  if (filter === 'weak') base = base.filter(w => weakIds.has(w.id));
  else if (filter === 'neverSeen') base = base.filter(w => neverIds.has(w.id));
  else if (filter === 'mastered') base = base.filter(w => masteredIds.has(w.id));

  if (base.length < 4 && filter !== 'todos') {
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
  const [inMode, setInMode] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  useRegisterActiveSession(inMode);

  useEffect(() => {
    updatePageSEO('Treino de Vocabulário', 'Estude vocabulário japonês N5 com flashcards, seleção de leitura, combinação de pares e quiz de tradução.');
  }, []);

  const words = getFilteredWords(filter, category);
  const stats = getVocabStats();

  const startMode = useCallback((m: VocabularyTrainingMode) => {
    setMode(m);
    setSessionCorrect(0);
    setSessionTotal(0);
    setRenderKey(k => k + 1);
    setInMode(true);
  }, [setMode]);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setRenderKey(k => k + 1);
  }, []);

  const handleFilterChange = useCallback((f: FilterType) => {
    setFilter(f);
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

  const activeMeta = MODE_CARDS.find(m => m.value === mode);

  return (
    <div>
      <PageHeader title="Treino · Vocabulário" description="Treine palavras N5 com quatro modos de estudo.">
        <button
          onClick={() => setShowConfig(v => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showConfig ? 'border-primary bg-accent text-primary' : 'border-border bg-card text-foreground hover:bg-muted'
          }`}
          data-testid="vocab-configure-header"
        >
          <MaterialIcon name="tune" size={18} />
          Configurar
        </button>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
        {!inMode ? (
          <>
            <AdPlaceholder slot="banner" />

            {/* Filtros inteligentes + categoria — atrás de "Configurar" */}
            {showConfig && (
              <section className="space-y-3 bg-card border border-border rounded-2xl p-5" data-testid="vocab-config-panel">
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
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        filter === f.value ? 'bg-foreground text-background' : 'bg-background border border-border text-[--color-text-secondary] hover:text-foreground'
                      }`}
                      data-testid={`vocab-filter-${f.value}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5" data-testid="vocab-categories">
                  <button
                    onClick={() => handleCategoryChange('todos')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                      category === 'todos' ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-[--color-text-secondary] hover:border-primary hover:text-primary'
                    }`}
                    data-testid="vocab-category-todos"
                  >
                    Todas as categorias
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                        category === cat ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-[--color-text-secondary] hover:border-primary hover:text-primary'
                      }`}
                      data-testid={`vocab-category-${cat}`}
                    >
                      {categoryLabels[cat] ?? cat}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Modos de treino — cards estilo Kana */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Modos de treino</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODE_CARDS.map(mc => (
                  <button
                    key={mc.value}
                    onClick={() => startMode(mc.value)}
                    className="text-left bg-card border border-border rounded-2xl p-5 flex flex-col gap-3.5 hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all"
                    data-testid={`vocab-mode-${mc.value}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary flex-shrink-0">
                        <MaterialIcon name={mc.icon} filled size={22} />
                      </div>
                      <span className="text-[11px] font-bold text-[--color-text-secondary] bg-background border border-border px-2 py-0.5 rounded-full">{mc.tag}</span>
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground mb-0.5">{mc.title}</h3>
                      <p className="text-xs text-[--color-text-secondary] leading-relaxed">{mc.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-bold">
                      Praticar <MaterialIcon name="arrow_forward" size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Stats row (real) */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MaterialIcon name="menu_book" filled size={22} />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-foreground">{words.length}</div>
                  <div className="text-xs text-[--color-text-secondary] font-semibold mt-0.5">Palavras disponíveis</div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MaterialIcon name="bolt" filled size={22} />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-foreground">{stats.weak}</div>
                  <div className="text-xs text-[--color-text-secondary] font-semibold mt-0.5">Difíceis para revisar</div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-[hsl(var(--tertiary))]/15 rounded-xl flex items-center justify-center text-[hsl(var(--tertiary))] flex-shrink-0">
                  <MaterialIcon name="check_circle" filled size={22} />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold text-[hsl(var(--tertiary))]">{stats.mastered}</div>
                  <div className="text-xs text-[--color-text-secondary] font-semibold mt-0.5">Palavras dominadas</div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Back header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setInMode(false)}
                className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-[--color-text-secondary] hover:border-primary hover:text-primary transition-colors flex-shrink-0"
                aria-label="Voltar aos modos"
              >
                <MaterialIcon name="arrow_back" size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-foreground">{activeMeta?.title}</h3>
                <p className="text-xs text-[--color-text-secondary]">
                  {sessionTotal > 0 ? `${sessionCorrect}/${sessionTotal} acertos nesta sessão` : `${words.length} palavras`}
                </p>
              </div>
            </div>

            {/* Hint do modo seleção */}
            {mode === 'word_selection' && (
              <div className="flex items-center justify-between gap-3 bg-card border border-border rounded-xl px-4 py-2.5">
                <span className="text-sm font-medium text-foreground">Mostrar tradução como dica</span>
                <button
                  role="switch"
                  aria-checked={showTranslationHint}
                  onClick={() => setShowTranslationHint(v => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showTranslationHint ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  data-testid="hint-toggle"
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${showTranslationHint ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {words.length === 0 ? (
              <div className="text-center py-12 text-[--color-text-secondary] text-sm">
                Nenhuma palavra encontrada para este filtro.
              </div>
            ) : (
              <div>{renderMode()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
