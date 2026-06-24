import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { vocabulary, categories } from '../data/vocabulary';
import type { VocabularyWord } from '../types/vocabulary';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { WordListCard } from '../components/vocabulary/WordListCard';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getWordProgressMap } from '../services/progress/progress.local';
import type { WordProgressRecord } from '../services/progress/progress.types';

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  saudações: { label: 'Saudações', emoji: '👋' },
  números: { label: 'Números', emoji: '🔢' },
  família: { label: 'Família', emoji: '👨‍👩‍👧' },
  comida: { label: 'Comida', emoji: '🍱' },
  cores: { label: 'Cores', emoji: '🎨' },
  tempo: { label: 'Tempo', emoji: '🕐' },
  lugares: { label: 'Lugares', emoji: '📍' },
  verbos: { label: 'Verbos', emoji: '⚡' },
  adjetivos: { label: 'Adjetivos', emoji: '✨' },
};

const LEVELS = ['N5', 'N4', 'N3', 'N2'];
const PAGE_SIZE_GRID = 12;
const PAGE_SIZE_LIST = 10;

type Status = 'mastered' | 'learning' | 'new';

function statusOf(word: VocabularyWord, map: Record<string, WordProgressRecord>): Status {
  const rec = map[word.id];
  if (!rec || rec.attempts === 0) return 'new';
  if (rec.attempts >= 5 && rec.correct / rec.attempts >= 0.85) return 'mastered';
  return 'learning';
}

function masteryOf(word: VocabularyWord, map: Record<string, WordProgressRecord>): number {
  const rec = map[word.id];
  if (!rec || rec.attempts === 0) return 0;
  return Math.max(1, Math.round((rec.correct / rec.attempts) * 5));
}

const STATUS_STYLES: Record<Status, { strip: string; badge: string; label: string }> = {
  mastered: { strip: 'bg-[hsl(var(--tertiary))]', badge: 'bg-[hsl(var(--tertiary))]/15 text-[hsl(var(--tertiary))]', label: 'Dominada' },
  learning: { strip: 'bg-primary', badge: 'bg-accent text-primary', label: 'Aprendendo' },
  new: { strip: 'bg-border', badge: 'bg-muted text-[--color-text-secondary]', label: 'Nova' },
};

export function VocabularyLibraryPage() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('N5');
  const [category, setCategory] = useState('todas');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    updatePageSEO('Vocabulário — Biblioteca', 'Explore o vocabulário japonês N5: busque, filtre por categoria e ouça a pronúncia de cada palavra.');
  }, []);

  const progressMap = useMemo(() => getWordProgressMap(), []);
  const availableLevels = useMemo(() => new Set(vocabulary.map(w => w.level)), []);

  const levelWords = useMemo(() => vocabulary.filter(w => w.level === level), [level]);
  const masteredCount = levelWords.filter(w => statusOf(w, progressMap) === 'mastered').length;
  const learningCount = levelWords.filter(w => statusOf(w, progressMap) === 'learning').length;
  const newCount = levelWords.filter(w => statusOf(w, progressMap) === 'new').length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return levelWords.filter(w => {
      if (category !== 'todas' && w.category !== category) return false;
      if (!q) return true;
      return (
        w.japanese.toLowerCase().includes(q) ||
        w.kana.toLowerCase().includes(q) ||
        w.romaji.toLowerCase().includes(q) ||
        w.meaningPt.toLowerCase().includes(q)
      );
    });
  }, [levelWords, query, category]);

  const pageSize = view === 'grid' ? PAGE_SIZE_GRID : PAGE_SIZE_LIST;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);
  const hasActiveFilter = category !== 'todas' || !!query.trim();
  const clearFilters = () => { setCategory('todas'); setQuery(''); resetPage(); };

  return (
    <div>
      <PageHeader title="Vocabulário" description="Explore e ouça as palavras do seu caminho.">
        <Link
          href="/vocabulario/treinar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          data-testid="vocab-train-cta"
        >
          <MaterialIcon name="sports_esports" filled size={18} />
          Treinar
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Hero search + stats */}
        <section className="relative overflow-hidden bg-foreground rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute -right-5 -top-5 opacity-[0.06] pointer-events-none select-none text-background font-japanese">
            <span className="text-[180px] font-bold leading-none">語</span>
          </div>
          <div className="flex-1 relative z-10 w-full">
            <h2 className="font-heading text-xl font-bold text-background mb-1.5">Banco de palavras</h2>
            <p className="text-sm text-background/60 mb-5">{levelWords.length} palavras · {masteredCount} dominadas</p>
            <div className="flex items-center bg-background/10 border border-background/20 rounded-xl px-4 max-w-md focus-within:border-background/50 transition-colors">
              <MaterialIcon name="search" size={20} className="text-background/50 flex-shrink-0" />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); resetPage(); }}
                className="flex-1 border-none py-3 px-2.5 text-sm bg-transparent text-background placeholder:text-background/50 outline-none"
                placeholder="Buscar por palavra, kana ou significado…"
                type="text"
                data-testid="vocab-search"
              />
              {query && (
                <button onClick={() => { setQuery(''); resetPage(); }} className="text-background/50 hover:text-background p-1">
                  <MaterialIcon name="close" size={18} />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 relative z-10 flex-shrink-0">
            <div className="bg-background/[0.08] border border-background/10 rounded-xl px-5 py-4 text-center min-w-[80px]">
              <div className="font-heading text-2xl font-extrabold text-background">{masteredCount}</div>
              <div className="text-[11px] font-semibold text-background/50 uppercase tracking-wider mt-0.5">Dominadas</div>
            </div>
            <div className="bg-background/[0.08] border border-background/10 rounded-xl px-5 py-4 text-center min-w-[80px]">
              <div className="font-heading text-2xl font-extrabold text-primary">{learningCount}</div>
              <div className="text-[11px] font-semibold text-background/50 uppercase tracking-wider mt-0.5">Aprendendo</div>
            </div>
            <div className="bg-background/[0.08] border border-background/10 rounded-xl px-5 py-4 text-center min-w-[80px]">
              <div className="font-heading text-2xl font-extrabold text-background/40">{newCount}</div>
              <div className="text-[11px] font-semibold text-background/50 uppercase tracking-wider mt-0.5">Novas</div>
            </div>
          </div>
        </section>

        {/* JLPT tabs */}
        <div className="inline-flex bg-card border border-border rounded-full p-1 gap-0.5">
          {LEVELS.map(lv => {
            const enabled = availableLevels.has(lv);
            const count = vocabulary.filter(w => w.level === lv).length;
            return (
              <button
                key={lv}
                disabled={!enabled}
                onClick={() => { setLevel(lv); resetPage(); }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  level === lv
                    ? 'bg-primary text-primary-foreground font-extrabold'
                    : enabled
                    ? 'text-[--color-text-secondary] font-semibold hover:text-foreground'
                    : 'text-[--color-text-secondary] font-semibold opacity-40 cursor-not-allowed'
                }`}
                title={enabled ? undefined : 'Em breve'}
                data-testid={`vocab-level-${lv}`}
              >
                {lv} <span className="text-xs opacity-70 ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Categories + controls */}
        <div className="flex items-center justify-between flex-wrap gap-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setCategory('todas'); resetPage(); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                category === 'todas' ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-[--color-text-secondary] hover:border-primary hover:text-primary'
              }`}
            >
              Todas
            </button>
            {categories.map(cat => {
              const meta = categoryLabels[cat] ?? { label: cat, emoji: '' };
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); resetPage(); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    active ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-[--color-text-secondary] hover:border-primary hover:text-primary'
                  }`}
                >
                  {meta.emoji && <span>{meta.emoji}</span>}
                  {meta.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex bg-card border border-border rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => { setView('grid'); resetPage(); }}
                className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-[--color-text-secondary] hover:text-foreground'}`}
                aria-label="Visualização em grade"
              >
                <MaterialIcon name="grid_view" size={18} />
              </button>
              <button
                onClick={() => { setView('list'); resetPage(); }}
                className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-[--color-text-secondary] hover:text-foreground'}`}
                aria-label="Visualização em lista"
              >
                <MaterialIcon name="view_list" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter status strip */}
        {hasActiveFilter && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-accent border border-primary/30 rounded-xl">
            <MaterialIcon name="filter_list" filled size={18} className="text-primary" />
            <span className="text-sm font-semibold text-primary flex-1">
              {filtered.length} palavra{filtered.length !== 1 ? 's' : ''}
              {category !== 'todas' && ` · ${categoryLabels[category]?.label ?? category}`}
              {query.trim() && ` · "${query.trim()}"`}
            </span>
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-70">
              <MaterialIcon name="close" size={16} />
              Limpar filtro
            </button>
          </div>
        )}

        {/* Results */}
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <MaterialIcon name="search_off" size={64} className="text-border" />
            <h3 className="font-heading text-xl font-bold text-foreground">Nenhuma palavra encontrada</h3>
            <p className="text-sm text-[--color-text-secondary]">Tente outro termo ou limpe os filtros.</p>
            <button onClick={clearFilters} className="mt-1 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              Limpar filtros
            </button>
          </div>
        ) : view === 'grid' ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {pageItems.map(word => {
              const status = statusOf(word, progressMap);
              const s = STATUS_STYLES[status];
              const meta = categoryLabels[word.category] ?? { label: word.category, emoji: '' };
              return (
                <div key={word.id} className="bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all">
                  <div className={`h-1 ${s.strip}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-japanese text-3xl font-bold text-foreground leading-none">{word.japanese}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${s.badge}`}>{s.label}</span>
                    </div>
                    <p className="font-japanese text-xs text-[--color-text-secondary] mb-2">{word.kana}</p>
                    <p className="text-sm font-semibold text-foreground leading-snug">{word.meaningPt}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-background border border-border rounded-full text-[--color-text-secondary] whitespace-nowrap">
                        {meta.emoji} {meta.label}
                      </span>
                      <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-[--color-text-secondary] hover:border-primary hover:text-primary hover:bg-accent transition-colors">
                        <MaterialIcon name="volume_up" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4">
            {pageItems.map(word => (
              <WordListCard
                key={word.id}
                word={word}
                mastery={masteryOf(word, progressMap)}
                categoryLabel={categoryLabels[word.category]?.label ?? word.category}
              />
            ))}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-[--color-text-secondary] hover:border-primary hover:text-primary transition-all disabled:opacity-40"
              aria-label="Página anterior"
            >
              <MaterialIcon name="chevron_left" size={20} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  safePage === i + 1
                    ? 'bg-primary border border-primary text-primary-foreground'
                    : 'border border-border bg-card text-[--color-text-secondary] hover:border-primary hover:text-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-[--color-text-secondary] hover:border-primary hover:text-primary transition-all disabled:opacity-40"
              aria-label="Próxima página"
            >
              <MaterialIcon name="chevron_right" size={20} />
            </button>
          </div>
        )}

        <AdPlaceholder slot="banner" />
      </div>
    </div>
  );
}
