import { useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { kanji as allKanji } from '../data/kanji';
import type { KanjiItem } from '../types/kanji';
import { getMasteredKanji, getNeverSeenKanji, getWeakKanji, getKanjiCharacterStats } from '../services/progress/progress.local';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { KanjiSubNav } from '../components/kanji/KanjiSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';

const DISPLAY_LIMIT = 24;

function resolveItems(ids: string[]): KanjiItem[] {
  const map = new Map(allKanji.map(k => [k.id, k]));
  return ids.map(id => map.get(id)).filter((k): k is KanjiItem => !!k);
}

function MiniCard({ item }: { item: KanjiItem }) {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 border-border bg-card shadow-sm" data-testid="kanji-character-card">
      <span className="text-3xl font-medium" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{item.character}</span>
      <span className="text-[10px] text-muted-foreground mt-1 text-center px-1 truncate w-full">{item.meaningPt}</span>
    </div>
  );
}

export function KanjiReviewPage() {
  const [, setLocation] = useLocation();
  const [, setOnlyWeak] = useLocalStorage('kanji_only_weak', false);

  useEffect(() => {
    updatePageSEO('Revisar Kanji', 'Revise os kanji difíceis, nunca vistos e os que você já domina.');
  }, []);

  const allIds = useMemo(() => allKanji.map(k => k.id), []);
  const weakItems = useMemo(() => resolveItems(getWeakKanji(allIds, 100)), [allIds]);
  const neverSeenItems = useMemo(() => resolveItems(getNeverSeenKanji(allIds)), [allIds]);
  const masteredItems = useMemo(() => resolveItems(getMasteredKanji(allIds)), [allIds]);

  const handlePracticeWeak = () => {
    setOnlyWeak(true);
    setLocation('/kanji/treinar');
  };

  return (
    <div>
      <PageHeader title="Revisar Kanji" description="Foque nos kanji difíceis, nunca vistos e veja os que você já domina." color="#F59F00" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <KanjiSubNav />

        <AdPlaceholder slot="banner" />

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Difíceis <span className="text-[--color-text-secondary] font-normal text-base">({weakItems.length})</span>
              </h2>
              <p className="text-xs text-[--color-text-secondary] mt-0.5">
                Pelo menos 3 tentativas e menos de 60% de acerto.
              </p>
            </div>
            {weakItems.length > 0 && (
              <button
                onClick={handlePracticeWeak}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex-shrink-0"
                data-testid="kanji-review-practice-weak-btn"
              >
                <MaterialIcon name="bolt" filled size={16} />
                Praticar agora
              </button>
            )}
          </div>
          {weakItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum kanji com baixa precisão no momento. Continue treinando!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {weakItems.slice(0, DISPLAY_LIMIT).map(item => {
                const charStats = getKanjiCharacterStats(item.id);
                return (
                  <div key={item.id} className="flex flex-col items-center gap-1">
                    <MiniCard item={item} />
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

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Nunca vistos <span className="text-[--color-text-secondary] font-normal text-base">({neverSeenItems.length})</span>
            </h2>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">Kanji que você ainda não treinou nenhuma vez.</p>
          </div>
          {neverSeenItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você já praticou todos os kanji ao menos uma vez.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {neverSeenItems.slice(0, DISPLAY_LIMIT).map(item => (
                <MiniCard key={item.id} item={item} />
              ))}
              {neverSeenItems.length > DISPLAY_LIMIT && (
                <div className="flex items-center justify-center text-sm text-muted-foreground px-3">
                  +{neverSeenItems.length - DISPLAY_LIMIT} mais
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Dominados <span className="text-[--color-text-secondary] font-normal text-base">({masteredItems.length})</span>
            </h2>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">Pelo menos 5 tentativas e 85% ou mais de acerto.</p>
          </div>
          {masteredItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Continue treinando para dominar seus primeiros kanji.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {masteredItems.slice(0, DISPLAY_LIMIT).map(item => (
                <MiniCard key={item.id} item={item} />
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
