import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { KanaGroupFilter } from '../components/kana/KanaGroupFilter';
import { KanaModeSelector } from '../components/kana/KanaModeSelector';
import { KANA_MODE_COMPONENTS } from '../components/kana/modes';
import { PageHeader } from '../components/ui/PageHeader';
import { SettingsToggleRow } from '../components/ui/SettingsToggleRow';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { useRegisterActiveSession } from '../contexts/ActiveSessionContext';
import type { KanaTrainingMode } from '../types/kana';

const HINT_MODES: KanaTrainingMode[] = ['typing', 'flashcards', 'tracing'];

export function KanaTrainPage() {
  useRegisterActiveSession(true);

  const {
    script, setScript, groupPrefs, setGroupPrefs, onlyWeak, setOnlyWeak, filteredItems,
  } = useKanaFilters();
  const [trainMode, setTrainMode] = useLocalStorage<KanaTrainingMode>('kana_train_mode', 'typing');
  const [showRomajiHint, setShowRomajiHint] = useLocalStorage('kana_romaji_hint', false);
  const [trainerKey, setTrainerKey] = useState(0);

  useEffect(() => {
    updatePageSEO(
      'Treinar Kana',
      'Treine hiragana e katakana com 7 modos diferentes: digitação, flashcards, escolha rápida, pares, escuta, montar palavra e traçado.',
    );
  }, []);

  const resetTrainer = useCallback(() => setTrainerKey(k => k + 1), []);

  const handleModeChange = useCallback((mode: KanaTrainingMode) => {
    setTrainMode(mode);
    resetTrainer();
  }, [setTrainMode, resetTrainer]);

  const handleScriptChange = useCallback((value: typeof script) => {
    setScript(value);
    resetTrainer();
  }, [setScript, resetTrainer]);

  const handleGroupPrefsChange = useCallback((prefs: typeof groupPrefs) => {
    setGroupPrefs(prefs);
    resetTrainer();
  }, [setGroupPrefs, resetTrainer]);

  const handleOnlyWeakChange = useCallback((value: boolean) => {
    setOnlyWeak(value);
    resetTrainer();
  }, [setOnlyWeak, resetTrainer]);

  const ModeComponent = KANA_MODE_COMPONENTS[trainMode];

  return (
    <div>
      <PageHeader title="Treinar Kana" description="Pratique hiragana e katakana no modo escolhido.">
        <Link
          href="/kana"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          <MaterialIcon name="arrow_back" size={18} />
          Hub
        </Link>
      </PageHeader>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <KanaSubNav />

        <AdPlaceholder slot="banner" />

        {/* Seletor de modo */}
        <KanaModeSelector value={trainMode} onChange={handleModeChange} />

        {/* Filtros */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <KanaGroupFilter
            script={script}
            onScriptChange={handleScriptChange}
            groupPrefs={groupPrefs}
            onGroupPrefsChange={handleGroupPrefsChange}
            onlyWeak={onlyWeak}
            onOnlyWeakChange={handleOnlyWeakChange}
          />
        </div>

        {/* Dica de romaji */}
        {HINT_MODES.includes(trainMode) && (
          <div className="bg-card border border-card-border rounded-xl px-4">
            <SettingsToggleRow
              icon="stylus"
              label="Mostrar leitura como dica"
              checked={showRomajiHint}
              onCheckedChange={setShowRomajiHint}
              data-testid="kana-romaji-hint-toggle"
            />
          </div>
        )}

        {/* Treino */}
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <ModeComponent key={trainerKey} items={filteredItems} showRomajiHint={showRomajiHint} />
        </div>
      </div>
    </div>
  );
}
