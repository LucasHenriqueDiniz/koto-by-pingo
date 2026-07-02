import type { MaterialIconName } from '../ui/MaterialIcon';
import type { KanjiTrainingMode } from '../../types/kanji';

interface ModeConfig {
  value: KanjiTrainingMode;
  label: string;
  description: string;
}

export const KANJI_MODES: ModeConfig[] = [
  { value: 'flashcards', label: 'Flashcards', description: 'Vire a carta e avalie' },
  { value: 'multiple_choice', label: 'Escolha rápida', description: 'Escolha o significado certo' },
  { value: 'matching_pairs', label: 'Combinar pares', description: 'Combine kanji e significado' },
  { value: 'tracing', label: 'Traçado', description: 'Veja e pratique o desenho' },
];

export const KANJI_MODE_LABELS: Record<KanjiTrainingMode, string> = KANJI_MODES.reduce(
  (acc, mode) => ({ ...acc, [mode.value]: mode.label }),
  {} as Record<KanjiTrainingMode, string>,
);

export const KANJI_MODE_ICONS: Record<KanjiTrainingMode, MaterialIconName> = {
  flashcards: 'style',
  multiple_choice: 'quiz',
  matching_pairs: 'join_inner',
  tracing: 'stylus',
};

export const KANJI_MODE_TAGS: Record<KanjiTrainingMode, string> = {
  flashcards: 'Clássico',
  multiple_choice: 'Rápido',
  matching_pairs: 'Memória',
  tracing: 'Traçado',
};

interface KanjiModeSelectorProps {
  value: KanjiTrainingMode;
  onChange: (mode: KanjiTrainingMode) => void;
}

export function KanjiModeSelector({ value, onChange }: KanjiModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="kanji-mode-selector">
      {KANJI_MODES.map(mode => {
        const active = value === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
              active ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-muted'
            }`}
            data-testid={`kanji-mode-${mode.value}`}
          >
            <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{mode.label}</p>
            <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}
