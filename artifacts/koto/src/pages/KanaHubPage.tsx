import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { KANA_MODES, KANA_MODE_ICONS, KANA_MODE_TAGS } from '../components/kana/KanaModeSelector';
import { BentoCharacterGrid } from '../components/kana/BentoCharacterGrid';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getKanaStats, getKanaAccuracy } from '../services/progress/progress.local';
import { getKanaByScript, getKanaByGroup } from '../data/kana';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { KanaScript, KanaTrainingMode } from '../types/kana';

export function KanaHubPage() {
  const [, navigate] = useLocation();
  const [, setKanaMode] = useLocalStorage<KanaTrainingMode>('kana_train_mode', 'typing');
  const [gridScript, setGridScript] = useState<KanaScript>('hiragana');

  useEffect(() => {
    updatePageSEO('Kana', 'Aprenda, treine e acompanhe seu progresso em hiragana e katakana.');
  }, []);

  const stats = getKanaStats();
  const accuracy = getKanaAccuracy();
  const masteryPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const basicKana = useMemo(() => getKanaByGroup(getKanaByScript(gridScript), 'basic'), [gridScript]);

  const startMode = (mode: KanaTrainingMode) => {
    setKanaMode(mode);
    navigate('/kana/treinar');
  };

  return (
    <div>
      <PageHeader title="Kana" description="Hiragana e katakana: aprenda, treine e acompanhe seu progresso.">
        <Link
          href="/kana/configurar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
          data-testid="kana-configure-header"
        >
          <MaterialIcon name="tune" size={18} />
          Configurar
        </Link>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
        <KanaSubNav />

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-card border border-border rounded-xl p-[18px]">
            <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-wider mb-2">Kana dominados</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">
              {stats.mastered}<span className="text-base text-muted-foreground/50">/{stats.total}</span>
            </p>
            <div className="w-full h-1 bg-accent rounded-full overflow-hidden mt-2.5">
              <div className="h-full bg-primary rounded-full" style={{ width: `${masteryPct}%` }} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-[18px]">
            <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-wider mb-2">Precisão</p>
            <p className="font-heading text-2xl font-extrabold text-[hsl(var(--tertiary))]">{accuracy}%</p>
            <div className="w-full h-1 bg-[hsl(var(--tertiary))]/15 rounded-full overflow-hidden mt-2.5">
              <div className="h-full bg-[hsl(var(--tertiary))] rounded-full" style={{ width: `${accuracy}%` }} />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-[18px]">
            <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-wider mb-2">Vistos</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">{stats.seen}<span className="text-base text-muted-foreground/50">/{stats.total}</span></p>
            <p className="text-xs text-[--color-text-secondary] mt-1.5">{stats.weak} difíceis para revisar</p>
          </div>
        </section>

        <AdPlaceholder slot="banner" />

        {/* Modos de treino */}
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Modos de treino</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KANA_MODES.map(mode => (
              <button
                key={mode.value}
                onClick={() => startMode(mode.value)}
                className="text-left bg-card border border-border rounded-2xl p-5 flex flex-col gap-3.5 hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all"
                data-testid={`kana-hub-mode-${mode.value}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary flex-shrink-0">
                    <MaterialIcon name={KANA_MODE_ICONS[mode.value]} filled size={22} />
                  </div>
                  <span className="text-[11px] font-bold text-[--color-text-secondary] bg-background border border-border px-2 py-0.5 rounded-full">
                    {KANA_MODE_TAGS[mode.value]}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground mb-0.5">{mode.label}</h3>
                  <p className="text-xs text-[--color-text-secondary] leading-relaxed">{mode.description}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-sm font-bold">
                  Praticar <MaterialIcon name="arrow_forward" size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Seu progresso */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h3 className="font-heading text-lg font-bold text-foreground">Seu progresso</h3>
            <div className="flex bg-background border border-border rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setGridScript('hiragana')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${gridScript === 'hiragana' ? 'bg-primary text-primary-foreground' : 'text-[--color-text-secondary] hover:text-foreground'}`}
              >
                あ Hiragana
              </button>
              <button
                onClick={() => setGridScript('katakana')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${gridScript === 'katakana' ? 'bg-primary text-primary-foreground' : 'text-[--color-text-secondary] hover:text-foreground'}`}
              >
                ア Katakana
              </button>
            </div>
          </div>
          <BentoCharacterGrid items={basicKana} />
        </section>
      </div>
    </div>
  );
}
