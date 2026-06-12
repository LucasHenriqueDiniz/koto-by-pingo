import type { KanaGroup, KanaType } from '../../types/kana';

export const KANA_GROUP_LABELS: Record<KanaGroup, string> = {
  basic: 'Básico',
  dakuten: 'Dakuten (゛)',
  handakuten: 'Handakuten (゜)',
  yoon: 'Yōon (ゃゅょ)',
};

const GROUP_ORDER: KanaGroup[] = ['basic', 'dakuten', 'handakuten', 'yoon'];

const SCRIPT_OPTIONS: { value: KanaType; label: string }[] = [
  { value: 'hiragana', label: 'Hiragana' },
  { value: 'katakana', label: 'Katakana' },
  { value: 'mixed', label: 'Misto' },
];

interface KanaGroupFilterProps {
  script: KanaType;
  onScriptChange: (script: KanaType) => void;
  groupPrefs: Record<KanaGroup, boolean>;
  onGroupPrefsChange: (prefs: Record<KanaGroup, boolean>) => void;
  onlyWeak: boolean;
  onOnlyWeakChange: (value: boolean) => void;
}

export function KanaGroupFilter({
  script,
  onScriptChange,
  groupPrefs,
  onGroupPrefsChange,
  onlyWeak,
  onOnlyWeakChange,
}: KanaGroupFilterProps) {
  const toggleGroup = (group: KanaGroup) => {
    onGroupPrefsChange({ ...groupPrefs, [group]: !groupPrefs[group] });
  };

  return (
    <div className="space-y-4" data-testid="kana-group-filter">
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Script</p>
        <div className="flex flex-wrap gap-2">
          {SCRIPT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onScriptChange(opt.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                script === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`kana-script-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Grupos</p>
        <div className="flex flex-wrap gap-2">
          {GROUP_ORDER.map(group => (
            <button
              key={group}
              type="button"
              onClick={() => toggleGroup(group)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                groupPrefs[group]
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`kana-group-${group}`}
              aria-pressed={groupPrefs[group]}
            >
              {KANA_GROUP_LABELS[group]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={onlyWeak}
          onChange={e => onOnlyWeakChange(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-[#E5484D]"
          data-testid="kana-only-weak-checkbox"
        />
        Apenas problemáticos
      </label>
    </div>
  );
}
