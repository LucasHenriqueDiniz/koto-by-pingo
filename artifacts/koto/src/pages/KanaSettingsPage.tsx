import { useEffect } from 'react';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanaGroupFilter } from '../components/kana/KanaGroupFilter';
import { KanaModeSelector } from '../components/kana/KanaModeSelector';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { SettingsToggleRow } from '../components/ui/SettingsToggleRow';
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

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <KanaSubNav />

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Grupos e filtros</h2>
          <KanaGroupFilter
            script={script}
            onScriptChange={setScript}
            groupPrefs={groupPrefs}
            onGroupPrefsChange={setGroupPrefs}
            onlyWeak={onlyWeak}
            onOnlyWeakChange={setOnlyWeak}
          />
        </section>

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Modo de treino padrão</h2>
          <KanaModeSelector value={trainMode} onChange={setTrainMode} />
        </section>

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-2">Dicas</h2>
          <SettingsToggleRow
            icon="stylus"
            label="Mostrar leitura como dica"
            description="Nos modos de digitação, flashcards e traçado."
            checked={showRomajiHint}
            onCheckedChange={setShowRomajiHint}
            data-testid="settings-romaji-hint-toggle"
          />
        </section>
      </div>
    </div>
  );
}
