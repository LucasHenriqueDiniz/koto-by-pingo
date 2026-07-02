import { useEffect, useState } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { getKanjiStats, getKanjiLevelStats, resetKanjiProgress } from '../services/progress/progress.local';
import { KanjiSubNav } from '../components/kanji/KanjiSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getAccuracyColor } from '../utils/scoring';

export function KanjiStatsPage() {
  const [stats, setStats] = useState(() => getKanjiStats());
  const [levelStats, setLevelStats] = useState(() => getKanjiLevelStats());
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    updatePageSEO('Estatísticas de Kanji', 'Acompanhe sua precisão geral e por nível JLPT de kanji.');
  }, []);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetKanjiProgress();
    setStats(getKanjiStats());
    setLevelStats(getKanjiLevelStats());
    setConfirmReset(false);
  };

  return (
    <div>
      <PageHeader title="Estatísticas de Kanji" description="Acompanhe sua precisão geral e por nível JLPT de kanji." color="#7C3AED" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <KanjiSubNav />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} icon="language" color="#006856" />
          <StatCard label="Vistos" value={stats.seen} icon="visibility" color="#565e74" />
          <StatCard label="Dominados" value={stats.mastered} icon="star" iconFilled color="#F59F00" />
          <StatCard label="Difíceis" value={stats.weak} icon="warning" color="#ac2b2f" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Precisão por nível</h2>
          <div className="space-y-3">
            {levelStats.map(l => (
              <div key={l.level}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{l.level}</span>
                  <span className="font-medium text-foreground">
                    {l.attempts > 0 ? `${l.correct}/${l.attempts} — ${l.accuracy}%` : 'Sem dados'}
                  </span>
                </div>
                <ProgressBar value={l.accuracy} color={getAccuracyColor(l.accuracy)} />
              </div>
            ))}
          </div>
        </div>

        <AdPlaceholder slot="banner" />

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">Resetar progresso de kanji</p>
              <p className="text-xs text-[--color-text-secondary] mt-0.5">Remove apenas o histórico de tentativas de kanji, sem afetar kana, vocabulário ou simulados.</p>
            </div>
            <div className="flex items-center gap-2">
              {confirmReset && (
                <button
                  onClick={() => setConfirmReset(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
                  data-testid="cancel-reset-kanji-progress-btn"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  confirmReset
                    ? 'bg-destructive text-destructive-foreground'
                    : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                data-testid="reset-kanji-progress-btn"
              >
                <MaterialIcon name="restart_alt" size={16} />
                {confirmReset ? 'Confirmar reset' : 'Resetar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
