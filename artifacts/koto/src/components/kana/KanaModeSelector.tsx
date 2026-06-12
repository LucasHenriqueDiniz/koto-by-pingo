import type { KanaTrainingMode } from '../../types/kana';

interface ModeConfig {
  value: KanaTrainingMode;
  label: string;
  description: string;
}

export const KANA_MODES: ModeConfig[] = [
  { value: 'typing', label: 'Digitação', description: 'Digite o romaji do kana' },
  { value: 'flashcards', label: 'Flashcards', description: 'Vire a carta e avalie' },
  { value: 'multiple_choice', label: 'Escolha rápida', description: 'Escolha o romaji certo' },
  { value: 'matching_pairs', label: 'Combinar pares', description: 'Combine kana e romaji' },
  { value: 'listening', label: 'Escuta', description: 'Ouça e responda' },
  { value: 'word_builder', label: 'Montar palavra', description: 'Monte palavras com kana' },
  { value: 'tracing', label: 'Traçado', description: 'Em breve' },
];

export const KANA_MODE_LABELS: Record<KanaTrainingMode, string> = KANA_MODES.reduce(
  (acc, mode) => ({ ...acc, [mode.value]: mode.label }),
  {} as Record<KanaTrainingMode, string>,
);

interface KanaModeSelectorProps {
  value: KanaTrainingMode;
  onChange: (mode: KanaTrainingMode) => void;
}

export function KanaModeSelector({ value, onChange }: KanaModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="kana-mode-selector">
      {KANA_MODES.map(mode => {
        const active = value === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
              active ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-muted'
            }`}
            data-testid={`kana-mode-${mode.value}`}
          >
            <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{mode.label}</p>
            <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}
