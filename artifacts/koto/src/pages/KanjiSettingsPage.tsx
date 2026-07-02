import { useEffect } from 'react';
import { useKanjiFilters } from '../hooks/useKanjiFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanjiModeSelector } from '../components/kanji/KanjiModeSelector';
import { KanjiSubNav } from '../components/kanji/KanjiSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { KANJI_LEVELS, KANJI_LEVELS_AVAILABLE as LEVELS_AVAILABLE } from '../data/kanji';
import { updatePageSEO } from '../utils/seo';
import type { KanjiTrainingMode } from '../types/kanji';

export function KanjiSettingsPage() {
  const { level, setLevel, onlyWeak, setOnlyWeak } = useKanjiFilters();
  const [trainMode, setTrainMode] = useLocalStorage<KanjiTrainingMode>('kanji_train_mode', 'flashcards');

  useEffect(() => {
    updatePageSEO('Configurar Kanji', 'Ajuste o nível JLPT, o modo de treino padrão e os filtros de kanji.');
  }, []);

  return (
    <div>
      <PageHeader title="Configurar Kanji" description="Ajuste suas preferências de aprendizado e treino de kanji." color="#16A34A" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <KanjiSubNav />

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Nível e filtros</h2>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Nível JLPT</p>
            <div className="flex flex-wrap gap-2">
              {KANJI_LEVELS.map(l => {
                const available = LEVELS_AVAILABLE.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    disabled={!available}
                    onClick={() => setLevel(l)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      level === l
                        ? 'bg-primary text-primary-foreground'
                        : available
                        ? 'bg-muted text-muted-foreground hover:text-foreground'
                        : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                    }`}
                    data-testid={`kanji-settings-level-${l}`}
                  >
                    {l}{!available && ' (em breve)'}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={onlyWeak}
              onChange={e => setOnlyWeak(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[#E5484D]"
              data-testid="kanji-settings-only-weak-checkbox"
            />
            Apenas problemáticos
          </label>
        </section>

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Modo de treino padrão</h2>
          <KanjiModeSelector value={trainMode} onChange={setTrainMode} />
        </section>
      </div>
    </div>
  );
}
