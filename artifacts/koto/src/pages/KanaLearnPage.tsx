import { useEffect, useMemo } from 'react';
import { getRowLabel } from '../data/kana';
import type { KanaGroup, KanaItem } from '../types/kana';
import { useKanaFilters } from '../hooks/useKanaFilters';
import { KanaCharacterCard } from '../components/kana/KanaCharacterCard';
import { KanaGroupFilter, KANA_GROUP_LABELS } from '../components/kana/KanaGroupFilter';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';

function groupByRow(items: KanaItem[]): { row: string; items: KanaItem[] }[] {
  const order: string[] = [];
  const map = new Map<string, KanaItem[]>();
  for (const item of items) {
    if (!map.has(item.row)) {
      map.set(item.row, []);
      order.push(item.row);
    }
    map.get(item.row)!.push(item);
  }
  return order.map(row => ({ row, items: map.get(row)! }));
}

export function KanaLearnPage() {
  const {
    script, setScript, groupPrefs, setGroupPrefs, onlyWeak, setOnlyWeak, filteredItems,
  } = useKanaFilters();

  useEffect(() => {
    updatePageSEO('Aprender Kana', 'Tabela de referência de hiragana e katakana organizada por grupos e linhas, com exemplos de palavras.');
  }, []);

  const sections = useMemo(() => {
    const order: KanaGroup[] = [];
    const map = new Map<KanaGroup, KanaItem[]>();
    for (const item of filteredItems) {
      if (!map.has(item.group)) {
        map.set(item.group, []);
        order.push(item.group);
      }
      map.get(item.group)!.push(item);
    }
    return order.map(group => ({ group, rows: groupByRow(map.get(group)!) }));
  }, [filteredItems]);

  return (
    <div>
      <PageHeader title="Aprender Kana" description="Consulte a tabela de hiragana e katakana organizada por grupos e linhas." color="#0284C7" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <KanaSubNav />

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <KanaGroupFilter
            script={script}
            onScriptChange={setScript}
            groupPrefs={groupPrefs}
            onGroupPrefsChange={setGroupPrefs}
            onlyWeak={onlyWeak}
            onOnlyWeakChange={setOnlyWeak}
          />
        </div>

        <AdPlaceholder slot="banner" />

        {sections.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Nenhum caractere disponível para este filtro.</p>
        )}

        {sections.map(({ group, rows }) => (
          <section key={group} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground">{KANA_GROUP_LABELS[group]}</h2>
            <div className="space-y-4">
              {rows.map(({ row, items }) => (
                <div key={row}>
                  <p className="text-xs font-medium text-muted-foreground mb-2 font-mono">{getRowLabel(row)}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <div key={item.id} className="flex flex-col items-center gap-1">
                        <KanaCharacterCard character={item.character} romaji={item.romaji} showRomaji size="sm" />
                        {item.examples?.[0] && (
                          <p className="text-[11px] text-muted-foreground text-center max-w-28 leading-tight">
                            <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{item.examples[0].word}</span>
                            {' · '}
                            {item.examples[0].meaningPt}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
