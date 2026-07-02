import { useMemo } from 'react';
import type { KanjiItem, KanjiJlptLevel } from '../types/kanji';
import { getKanjiByLevel } from '../data/kanji';
import { getWeakKanji } from '../services/progress/progress.local';
import { useLocalStorage } from './useLocalStorage';

/**
 * Preferências compartilhadas de filtro de kanji (nível JLPT, apenas problemáticos),
 * persistidas em localStorage e usadas por Aprender/Treinar/Revisar/Configurar.
 */
export function useKanjiFilters() {
  const [level, setLevel] = useLocalStorage<KanjiJlptLevel>('kanji_level', 'N5');
  const [onlyWeak, setOnlyWeak] = useLocalStorage('kanji_only_weak', false);

  const baseItems = useMemo(() => getKanjiByLevel(level), [level]);

  /** Itens prontos para treino: nível atual + filtro "apenas problemáticos" (com fallback). */
  const filteredItems = useMemo<KanjiItem[]>(() => {
    if (!onlyWeak) return baseItems;
    const weakIds = new Set(getWeakKanji(baseItems.map(k => k.id), 200));
    const weakPool = baseItems.filter(k => weakIds.has(k.id));
    return weakPool.length > 0 ? weakPool : baseItems;
  }, [baseItems, onlyWeak]);

  return {
    level,
    setLevel,
    onlyWeak,
    setOnlyWeak,
    baseItems,
    filteredItems,
  };
}
