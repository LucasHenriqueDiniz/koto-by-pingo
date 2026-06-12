import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getWeakKana } from '../services/progress/progress.local';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { KanaGroupFilter } from '../components/kana/KanaGroupFilter';
import { KanaModeSelector } from '../components/kana/KanaModeSelector';
import { KANA_MODE_COMPONENTS } from '../components/kana/modes';
import { RightStudyPanel } from '../components/layout/RightStudyPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import type { KanaTrainingMode } from '../types/kana';

const HINT_MODES: KanaTrainingMode[] = ['typing', 'flashcards', 'tracing'];

export function KanaTrainPage() {
  const {
    script, setScript, groupPrefs, setGroupPrefs, onlyWeak, setOnlyWeak, groupFilteredItems, filteredItems,
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

  const weakCount = useMemo(
    () => getWeakKana(groupFilteredItems.map(k => k.id), 200).length,
    [groupFilteredItems],
  );

  const ModeComponent = KANA_MODE_COMPONENTS[trainMode];

  const hint = onlyWeak
    ? 'Treinando apenas os caracteres com baixa precisão. Acerte para reduzir a lista.'
    : 'Use o filtro "Apenas problemáticos" para focar nos caracteres que você mais erra.';

  return (
    <div>
      <PageHeader title="Treinar Kana" description="Escolha um modo de treino e pratique hiragana e katakana." color="#E5484D" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <KanaSubNav />

        <div className="mb-6">
          <AdPlaceholder slot="banner" />
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 space-y-5">
            <KanaModeSelector value={trainMode} onChange={handleModeChange} />

            <div className="bg-muted/50 rounded-xl p-4">
              <KanaGroupFilter
                script={script}
                onScriptChange={handleScriptChange}
                groupPrefs={groupPrefs}
                onGroupPrefsChange={handleGroupPrefsChange}
                onlyWeak={onlyWeak}
                onOnlyWeakChange={handleOnlyWeakChange}
              />
            </div>

            {HINT_MODES.includes(trainMode) && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-sm w-full" htmlFor="kana-romaji-hint-toggle">
                  <span className="text-foreground font-medium flex-1">Mostrar leitura como dica</span>
                  <button
                    id="kana-romaji-hint-toggle"
                    type="button"
                    role="switch"
                    aria-checked={showRomajiHint}
                    onClick={() => setShowRomajiHint(v => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                      showRomajiHint ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    data-testid="kana-romaji-hint-toggle"
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        showRomajiHint ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            )}

            <ModeComponent key={trainerKey} items={filteredItems} showRomajiHint={showRomajiHint} />
          </div>

          <RightStudyPanel mode={trainMode} weakCount={weakCount} hint={hint} />
        </div>
      </div>
    </div>
  );
}
