import { useEffect, useMemo, useState } from 'react';
import type { KanaItem, KanaType } from '../types/kana';
import { getKanaByType, hiragana, katakana } from '../data/kana';
import { KanaTrainer } from '../components/kana/KanaTrainer';
import { RightStudyPanel } from '../components/layout/RightStudyPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  getWeakKana,
  getMasteredKana,
  getNeverSeenKana,
  getKanaFilterStats,
} from '../services/progress/progress.local';

type KanaFilter = 'todas' | 'novas' | 'dificeis' | 'dominadas';

const kanaTypeTabs: { value: KanaType; label: string }[] = [
  { value: 'hiragana', label: 'Hiragana' },
  { value: 'katakana', label: 'Katakana' },
  { value: 'mixed', label: 'Misto' },
];

// Group display labels — uses the first character of each group
const groupRowLabels: Record<string, string> = {
  'a-row': 'あ行',
  'ka-row': 'か行',
  'sa-row': 'さ行',
  'ta-row': 'た行',
  'na-row': 'な行',
  'ha-row': 'は行',
  'ma-row': 'ま行',
  'ya-row': 'や行',
  'ra-row': 'ら行',
  'wa-row': 'わ行',
  'n': 'ん',
};

const groupRowLabelsKata: Record<string, string> = {
  'a-row': 'ア行',
  'ka-row': 'カ行',
  'sa-row': 'サ行',
  'ta-row': 'タ行',
  'na-row': 'ナ行',
  'ha-row': 'ハ行',
  'ma-row': 'マ行',
  'ya-row': 'ヤ行',
  'ra-row': 'ラ行',
  'wa-row': 'ワ行',
  'n': 'ン',
};

function getGroupLabel(group: string, type: KanaType): string {
  if (type === 'katakana') return groupRowLabelsKata[group] ?? group;
  return groupRowLabels[group] ?? group;
}

const GROUP_ORDER = ['a-row', 'ka-row', 'sa-row', 'ta-row', 'na-row', 'ha-row', 'ma-row', 'ya-row', 'ra-row', 'wa-row', 'n'];

export function KanaPage() {
  const [kanaType, setKanaType] = useLocalStorage<KanaType>('kana_type', 'hiragana');
  const [filter, setFilter] = useState<KanaFilter>('todas');
  const [selectedGroup, setSelectedGroup] = useState<string>('todas');
  const [showRomajiHint, setShowRomajiHint] = useLocalStorage('kana_romaji_hint', false);
  const [trainerKey, setTrainerKey] = useState(0);

  useEffect(() => {
    updatePageSEO('Treino de Kana', 'Treine hiragana e katakana com feedback imediato. Registre seu progresso e acompanhe sua evolução.');
  }, []);

  // All kana for the current type
  const baseKana = useMemo(() => getKanaByType(kanaType), [kanaType]);
  const allIds = useMemo(() => baseKana.map(k => k.id), [baseKana]);

  // Available groups for the current type (no mixed label collision)
  const groups = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const g of GROUP_ORDER) {
      if (baseKana.some(k => k.group === g) && !seen.has(g)) {
        seen.add(g);
        ordered.push(g);
      }
    }
    return ordered;
  }, [baseKana]);

  // Filter stats
  const filterStats = useMemo(() => getKanaFilterStats(allIds), [allIds, trainerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute the actual items to train
  const trainingItems: KanaItem[] = useMemo(() => {
    let pool = baseKana;

    // Group filter first
    if (selectedGroup !== 'todas') {
      pool = pool.filter(k => k.group === selectedGroup);
    }

    const ids = pool.map(k => k.id);

    // Smart filter
    if (filter === 'novas') {
      const set = new Set(getNeverSeenKana(ids));
      pool = pool.filter(k => set.has(k.id));
    } else if (filter === 'dificeis') {
      const set = new Set(getWeakKana(ids));
      pool = pool.filter(k => set.has(k.id));
    } else if (filter === 'dominadas') {
      const set = new Set(getMasteredKana(ids));
      pool = pool.filter(k => set.has(k.id));
    }

    // Fallback: never leave trainer empty
    return pool.length > 0 ? pool : baseKana;
  }, [baseKana, filter, selectedGroup]);

  const resetTrainer = (opts: { type?: KanaType; filter?: KanaFilter; group?: string }) => {
    if (opts.type !== undefined) setKanaType(opts.type);
    if (opts.filter !== undefined) setFilter(opts.filter);
    if (opts.group !== undefined) setSelectedGroup(opts.group);
    setTrainerKey(k => k + 1);
  };

  return (
    <div>
      <PageHeader
        title="Treino de Kana"
        description="Treine hiragana e katakana com feedback imediato."
        color="#E5484D"
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Ad before session */}
        <div className="mb-6">
          <AdPlaceholder slot="banner" />
        </div>

        <div className="flex gap-6 items-start">
          {/* Main area */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Type selector */}
            <div className="flex bg-muted rounded-xl p-1 gap-1" data-testid="kana-type-tabs">
              {kanaTypeTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setSelectedGroup('todas');
                    resetTrainer({ type: tab.value, group: 'todas' });
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    kanaType === tab.value
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`kana-tab-${tab.value}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Smart filters */}
            <div className="flex flex-wrap gap-1.5" data-testid="kana-smart-filters">
              {([
                { value: 'todas', label: `Todas (${filterStats.total})` },
                { value: 'novas', label: `Novas (${filterStats.neverSeen})` },
                { value: 'dificeis', label: `Difíceis (${filterStats.weak})` },
                { value: 'dominadas', label: `Dominadas (${filterStats.mastered})` },
              ] as { value: KanaFilter; label: string }[]).map(f => (
                <button
                  key={f.value}
                  onClick={() => resetTrainer({ filter: f.value })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`kana-filter-${f.value}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Group (row) filter */}
            <div className="flex flex-wrap gap-1.5" data-testid="kana-group-filter">
              <button
                onClick={() => resetTrainer({ group: 'todas' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedGroup === 'todas'
                    ? 'text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                style={selectedGroup === 'todas' ? { backgroundColor: '#E5484D' } : {}}
                data-testid="kana-group-todas"
              >
                Todas as linhas
              </button>
              {groups.map(group => (
                <button
                  key={group}
                  onClick={() => resetTrainer({ group })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedGroup === group
                      ? 'text-white'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  style={selectedGroup === group ? { backgroundColor: '#E5484D' } : {}}
                  data-testid={`kana-group-${group}`}
                >
                  {getGroupLabel(group, kanaType)}
                </button>
              ))}
            </div>

            {/* Romaji hint toggle */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm w-full" htmlFor="romaji-hint-toggle">
                <span className="text-foreground font-medium flex-1">Mostrar leitura como dica</span>
                <button
                  id="romaji-hint-toggle"
                  role="switch"
                  aria-checked={showRomajiHint}
                  onClick={() => setShowRomajiHint(v => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    showRomajiHint ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  data-testid="romaji-hint-toggle"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      showRomajiHint ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Trainer */}
            <KanaTrainer
              key={trainerKey}
              items={trainingItems}
              showRomajiHint={showRomajiHint}
            />

            {/* Keyboard hint */}
            <p className="text-xs text-muted-foreground text-center">
              Pressione{' '}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono text-xs">Enter</kbd>{' '}
              para confirmar. Não diferencia maiúsculas.
            </p>
          </div>

          {/* Right panel (xl+) */}
          <RightStudyPanel
            mode={kanaType}
            category={selectedGroup === 'todas' ? 'todos' : selectedGroup}
            hint={
              filter === 'dificeis'
                ? 'Foque nestes caracteres até alcançar 60% de acerto.'
                : filter === 'novas'
                ? 'Caracteres que você ainda não treinou. Boa sorte!'
                : filter === 'dominadas'
                ? 'Revisão dos caracteres que você já domina.'
                : showRomajiHint
                ? 'Dica ativa: a leitura em romaji aparece abaixo do card.'
                : 'Desative a dica para um treino mais desafiador.'
            }
          />
        </div>
      </div>
    </div>
  );
}
