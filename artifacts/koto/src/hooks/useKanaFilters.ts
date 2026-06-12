import { useMemo } from 'react';
import type { KanaGroup, KanaItem, KanaType } from '../types/kana';
import { getKanaByType, KANA_GROUPS } from '../data/kana';
import { getWeakKana } from '../services/progress/progress.local';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_GROUP_PREFS: Record<KanaGroup, boolean> = KANA_GROUPS.reduce(
  (acc, group) => ({ ...acc, [group]: true }),
  {} as Record<KanaGroup, boolean>,
);

/**
 * Preferências compartilhadas de filtro de kana (script, grupos, apenas problemáticos),
 * persistidas em localStorage e usadas por Aprender/Treinar/Revisar/Configurar.
 */
export function useKanaFilters() {
  const [script, setScript] = useLocalStorage<KanaType>('kana_type', 'hiragana');
  const [groupPrefs, setGroupPrefs] = useLocalStorage<Record<KanaGroup, boolean>>('kana_group_prefs', DEFAULT_GROUP_PREFS);
  const [onlyWeak, setOnlyWeak] = useLocalStorage('kana_only_weak', false);

  const baseItems = useMemo(() => getKanaByType(script), [script]);

  /** Itens do script atual, restritos aos grupos habilitados (sem aplicar "apenas problemáticos"). */
  const groupFilteredItems = useMemo<KanaItem[]>(() => {
    const pool = baseItems.filter(k => groupPrefs[k.group]);
    return pool.length > 0 ? pool : baseItems;
  }, [baseItems, groupPrefs]);

  /** Itens prontos para treino: grupos habilitados + filtro "apenas problemáticos" (com fallback). */
  const filteredItems = useMemo<KanaItem[]>(() => {
    if (!onlyWeak) return groupFilteredItems;
    const weakIds = new Set(getWeakKana(groupFilteredItems.map(k => k.id), 200));
    const weakPool = groupFilteredItems.filter(k => weakIds.has(k.id));
    return weakPool.length > 0 ? weakPool : groupFilteredItems;
  }, [groupFilteredItems, onlyWeak]);

  return {
    script,
    setScript,
    groupPrefs,
    setGroupPrefs,
    onlyWeak,
    setOnlyWeak,
    baseItems,
    groupFilteredItems,
    filteredItems,
  };
}
