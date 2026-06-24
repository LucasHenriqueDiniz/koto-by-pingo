import { useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { allKana } from '../data/kana';
import type { KanaItem } from '../types/kana';
import { getMasteredKana, getNeverSeenKana, getWeakKana, getKanaCharacterStats } from '../services/progress/progress.local';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanaCharacterCard } from '../components/kana/KanaCharacterCard';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';

const DISPLAY_LIMIT = 24;

function resolveItems(ids: string[]): KanaItem[] {
  const map = new Map(allKana.map(k => [k.id, k]));
  return ids.map(id => map.get(id)).filter((k): k is KanaItem => !!k);
}

export function KanaReviewPage() {
  const [, setLocation] = useLocation();
  const [, setOnlyWeak] = useLocalStorage('kana_only_weak', false);

  useEffect(() => {
    updatePageSEO('Revisar Kana', 'Revise os caracteres difíceis, nunca vistos e os que você já domina.');
  }, []);

  const allIds = useMemo(() => allKana.map(k => k.id), []);
  const weakItems = useMemo(() => resolveItems(getWeakKana(allIds, 100)), [allIds]);
  const neverSeenItems = useMemo(() => resolveItems(getNeverSeenKana(allIds)), [allIds]);
  const masteredItems = useMemo(() => resolveItems(getMasteredKana(allIds)), [allIds]);

  const handlePracticeWeak = () => {
    setOnlyWeak(true);
    setLocation('/kana/treinar');
  };

  return (
    <div>
      <PageHeader title="Revisar Kana" description="Foque nos caracteres difíceis, nunca vistos e veja os que você já domina." color="#F59F00" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <KanaSubNav />

        <AdPlaceholder slot="banner" />

        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              Difíceis <span className="text-muted-foreground font-normal">({weakItems.length})</span>
            </h2>
            {weakItems.length > 0 && (
              <button
                onClick={handlePracticeWeak}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                data-testid="kana-review-practice-weak-btn"
              >
                <MaterialIcon name="bolt" filled size={16} />
                Praticar agora
              </button>
            )}
          </div>
          {weakItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum caractere com baixa precisão no momento. Continue treinando!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {weakItems.slice(0, DISPLAY_LIMIT).map(item => {
                const charStats = getKanaCharacterStats(item.id);
                return (
                  <div key={item.id} className="flex flex-col items-center gap-1">
                    <KanaCharacterCard character={item.character} romaji={item.romaji} showRomaji size="sm" />
                    <p className="text-xs font-medium" style={{ color: '#E5484D' }}>{charStats.accuracy}%</p>
                  </div>
                );
              })}
              {weakItems.length > DISPLAY_LIMIT && (
                <div className="flex items-center justify-center text-sm text-muted-foreground px-3">
                  +{weakItems.length - DISPLAY_LIMIT} mais
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Nunca vistos <span className="text-muted-foreground font-normal">({neverSeenItems.length})</span>
          </h2>
          {neverSeenItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você já praticou todos os caracteres ao menos uma vez.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {neverSeenItems.slice(0, DISPLAY_LIMIT).map(item => (
                <KanaCharacterCard key={item.id} character={item.character} romaji={item.romaji} showRomaji size="sm" />
              ))}
              {neverSeenItems.length > DISPLAY_LIMIT && (
                <div className="flex items-center justify-center text-sm text-muted-foreground px-3">
                  +{neverSeenItems.length - DISPLAY_LIMIT} mais
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Dominados <span className="text-muted-foreground font-normal">({masteredItems.length})</span>
          </h2>
          {masteredItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Continue treinando para dominar seus primeiros caracteres.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {masteredItems.slice(0, DISPLAY_LIMIT).map(item => (
                <KanaCharacterCard key={item.id} character={item.character} romaji={item.romaji} showRomaji size="sm" />
              ))}
              {masteredItems.length > DISPLAY_LIMIT && (
                <div className="flex items-center justify-center text-sm text-muted-foreground px-3">
                  +{masteredItems.length - DISPLAY_LIMIT} mais
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
