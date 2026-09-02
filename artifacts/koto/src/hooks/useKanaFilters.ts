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
 * Shared kana filter preferences (script, groups, troublesome-only), persisted in
 * localStorage and used by the learn/train/review/settings pages.
 */
export function useKanaFilters() {
  const [script, setScript] = useLocalStorage<KanaType>('kana_type', 'hiragana');
  const [groupPrefs, setGroupPrefs] = useLocalStorage<Record<KanaGroup, boolean>>('kana_group_prefs', DEFAULT_GROUP_PREFS);
  const [onlyWeak, setOnlyWeak] = useLocalStorage('kana_only_weak', false);

  const baseItems = useMemo(() => getKanaByType(script), [script]);

  /** Items of the current script, restricted to the enabled groups (troublesome-only not applied). */
  const groupFilteredItems = useMemo<KanaItem[]>(() => {
    const pool = baseItems.filter(k => groupPrefs[k.group]);
    return pool.length > 0 ? pool : baseItems;
  }, [baseItems, groupPrefs]);

  /** Items ready for training: enabled groups + troublesome-only filter (with fallback). */
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
