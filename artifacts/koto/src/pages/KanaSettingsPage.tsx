import { useEffect } from 'react';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanaGroupFilter } from '../components/kana/KanaGroupFilter';
import { KanaModeSelector } from '../components/kana/KanaModeSelector';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { updatePageSEO } from '../utils/seo';
import type { KanaTrainingMode } from '../types/kana';

export function KanaSettingsPage() {
  const { script, setScript, groupPrefs, setGroupPrefs, onlyWeak, setOnlyWeak } = useKanaFilters();
  const [trainMode, setTrainMode] = useLocalStorage<KanaTrainingMode>('kana_train_mode', 'typing');
  const [showRomajiHint, setShowRomajiHint] = useLocalStorage('kana_romaji_hint', false);

  useEffect(() => {
    updatePageSEO('Configurar Kana', 'Ajuste os grupos de kana, o modo de treino padrão e as dicas exibidas.');
  }, []);

  return (
    <div>
      <PageHeader title="Configurar Kana" description="Ajuste suas preferências de aprendizado e treino." color="#16A34A" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <KanaSubNav />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Grupos e filtros</h2>
          <KanaGroupFilter
            script={script}
            onScriptChange={setScript}
            groupPrefs={groupPrefs}
            onGroupPrefsChange={setGroupPrefs}
            onlyWeak={onlyWeak}
            onOnlyWeakChange={setOnlyWeak}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Modo de treino padrão</h2>
          <KanaModeSelector value={trainMode} onChange={setTrainMode} />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Dicas</h2>
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5">
            <label className="flex items-center gap-2 cursor-pointer text-sm w-full" htmlFor="settings-romaji-hint-toggle">
              <span className="text-foreground font-medium flex-1">Mostrar leitura como dica nos modos de digitação, flashcards e traçado</span>
              <button
                id="settings-romaji-hint-toggle"
                type="button"
                role="switch"
                aria-checked={showRomajiHint}
                onClick={() => setShowRomajiHint(v => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                  showRomajiHint ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                data-testid="settings-romaji-hint-toggle"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showRomajiHint ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
