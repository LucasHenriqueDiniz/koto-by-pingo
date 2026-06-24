import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanaGroupFilter, KANA_GROUP_LABELS } from '../components/kana/KanaGroupFilter';
import { KANA_MODE_LABELS } from '../components/kana/KanaModeSelector';
import { KANA_MODE_COMPONENTS } from '../components/kana/modes';
import { SettingsToggleRow } from '../components/ui/SettingsToggleRow';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import { updatePageSEO } from '../utils/seo';
import { useRegisterActiveSession } from '../contexts/ActiveSessionContext';
import type { KanaGroup, KanaTrainingMode } from '../types/kana';

const HINT_MODES: KanaTrainingMode[] = ['typing', 'flashcards', 'tracing'];

const SCRIPT_LABELS: Record<string, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  mixed: 'Misto',
};

export function KanaTrainPage() {
  useRegisterActiveSession(true);

  const {
    script, setScript, groupPrefs, setGroupPrefs, onlyWeak, setOnlyWeak, filteredItems,
  } = useKanaFilters();
  const [trainMode] = useLocalStorage<KanaTrainingMode>('kana_train_mode', 'typing');
  const [showRomajiHint, setShowRomajiHint] = useLocalStorage('kana_romaji_hint', false);
  const [trainerKey, setTrainerKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    updatePageSEO(
      'Treinar Kana',
      'Treine hiragana e katakana com 7 modos diferentes: digitação, flashcards, escolha rápida, pares, escuta, montar palavra e traçado.',
    );
  }, []);

  const resetTrainer = useCallback(() => setTrainerKey(k => k + 1), []);

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

  const groupsLabel = useMemo(() => {
    const active = (Object.keys(groupPrefs) as KanaGroup[]).filter(g => groupPrefs[g]);
    if (active.length === 4) return 'Todos os grupos';
    return active.map(g => KANA_GROUP_LABELS[g]).join(', ') || 'Nenhum grupo';
  }, [groupPrefs]);

  return (
    <div>
      {/* Top bar — voltar (encerra a sessão), título do modo, configurar */}
      <div className="border-b border-border bg-card/85 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/kana"
            className="flex items-center gap-1.5 flex-shrink-0 bg-background border border-border text-[--color-text-secondary] px-3.5 py-2 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
            data-testid="kana-train-exit"
          >
            <MaterialIcon name="arrow_back" size={18} />
            Modos
          </Link>
          <div className="flex-1 text-center min-w-0">
            <h1 className="font-heading text-base font-bold text-foreground truncate">{KANA_MODE_LABELS[trainMode]}</h1>
            <p className="text-xs text-[--color-text-secondary] truncate">{SCRIPT_LABELS[script]} · {groupsLabel}</p>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold bg-background border border-border text-[--color-text-secondary] hover:border-primary hover:text-primary transition-colors"
            data-testid="kana-train-configure"
          >
            <MaterialIcon name="tune" size={18} />
            Configurar
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <AdPlaceholder slot="banner" />

        {/* Treino — cartão elevado */}
        <div className="bg-card border border-border rounded-3xl shadow-sm p-8 sm:p-10">
          <ModeComponent key={trainerKey} items={filteredItems} showRomajiHint={showRomajiHint} />
        </div>
      </div>

      {/* Configurar — drawer */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent data-testid="kana-train-filters-drawer">
          <SheetHeader>
            <SheetTitle>Configuração</SheetTitle>
            <SheetDescription>Ajuste o escopo do treino atual</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <KanaGroupFilter
              script={script}
              onScriptChange={handleScriptChange}
              groupPrefs={groupPrefs}
              onGroupPrefsChange={handleGroupPrefsChange}
              onlyWeak={onlyWeak}
              onOnlyWeakChange={handleOnlyWeakChange}
            />
            {HINT_MODES.includes(trainMode) && (
              <div className="border-t border-border pt-1">
                <SettingsToggleRow
                  icon="stylus"
                  label="Mostrar leitura como dica"
                  checked={showRomajiHint}
                  onCheckedChange={setShowRomajiHint}
                  data-testid="kana-romaji-hint-toggle"
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
