import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useKanjiFilters } from '../hooks/useKanjiFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KANJI_MODE_LABELS } from '../components/kanji/KanjiModeSelector';
import { KANJI_MODE_COMPONENTS } from '../components/kanji/modes';
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
import { KANJI_LEVELS } from '../data/kanji';
import type { KanjiJlptLevel, KanjiTrainingMode } from '../types/kanji';

const LEVELS_AVAILABLE: KanjiJlptLevel[] = ['N5', 'N4'];

export function KanjiTrainPage() {
  useRegisterActiveSession(true);

  const { level, setLevel, onlyWeak, setOnlyWeak, filteredItems } = useKanjiFilters();
  const [trainMode] = useLocalStorage<KanjiTrainingMode>('kanji_train_mode', 'flashcards');
  const [trainerKey, setTrainerKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    updatePageSEO(
      'Treinar Kanji',
      'Treine kanji do N5 com 4 modos diferentes: flashcards, escolha rápida, pares e traçado.',
    );
  }, []);

  const resetTrainer = useCallback(() => setTrainerKey(k => k + 1), []);

  const handleLevelChange = useCallback((value: KanjiJlptLevel) => {
    setLevel(value);
    resetTrainer();
  }, [setLevel, resetTrainer]);

  const handleOnlyWeakChange = useCallback((value: boolean) => {
    setOnlyWeak(value);
    resetTrainer();
  }, [setOnlyWeak, resetTrainer]);

  const ModeComponent = KANJI_MODE_COMPONENTS[trainMode];

  return (
    <div>
      <div className="border-b border-border bg-card/85 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/kanji"
            className="flex items-center gap-1.5 flex-shrink-0 bg-background border border-border text-[--color-text-secondary] px-3.5 py-2 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
            data-testid="kanji-train-exit"
          >
            <MaterialIcon name="arrow_back" size={18} />
            Modos
          </Link>
          <div className="flex-1 text-center min-w-0">
            <h1 className="font-heading text-base font-bold text-foreground truncate">{KANJI_MODE_LABELS[trainMode]}</h1>
            <p className="text-xs text-[--color-text-secondary] truncate">{level}</p>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-semibold bg-background border border-border text-[--color-text-secondary] hover:border-primary hover:text-primary transition-colors"
            data-testid="kanji-train-configure"
          >
            <MaterialIcon name="tune" size={18} />
            Configurar
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <AdPlaceholder slot="banner" />

        <div className="bg-card border border-border rounded-3xl shadow-sm p-8 sm:p-10">
          <ModeComponent key={trainerKey} items={filteredItems} />
        </div>
      </div>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent data-testid="kanji-train-filters-drawer">
          <SheetHeader>
            <SheetTitle>Configuração</SheetTitle>
            <SheetDescription>Ajuste o escopo do treino atual</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
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
                      onClick={() => handleLevelChange(l)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        level === l
                          ? 'bg-primary text-primary-foreground'
                          : available
                          ? 'bg-muted text-muted-foreground hover:text-foreground'
                          : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                      }`}
                      data-testid={`kanji-level-${l}`}
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
                onChange={e => handleOnlyWeakChange(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[#E5484D]"
                data-testid="kanji-only-weak-checkbox"
              />
              Apenas problemáticos
            </label>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
