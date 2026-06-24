import { useEffect, useState } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { getKanaStats, getKanaGroupStats, resetKanaProgress } from '../services/progress/progress.local';
import { KANA_GROUP_LABELS } from '../components/kana/KanaGroupFilter';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getAccuracyColor } from '../utils/scoring';

export function KanaStatsPage() {
  const [stats, setStats] = useState(() => getKanaStats());
  const [groupStats, setGroupStats] = useState(() => getKanaGroupStats());
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    updatePageSEO('Estatísticas de Kana', 'Acompanhe sua precisão geral e por grupo de kana.');
  }, []);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetKanaProgress();
    setStats(getKanaStats());
    setGroupStats(getKanaGroupStats());
    setConfirmReset(false);
  };

  return (
    <div>
      <PageHeader title="Estatísticas de Kana" description="Acompanhe sua precisão geral e por grupo de kana." color="#7C3AED" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <KanaSubNav />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} icon="menu_book" color="#006856" />
          <StatCard label="Vistos" value={stats.seen} icon="visibility" color="#565e74" />
          <StatCard label="Dominados" value={stats.mastered} icon="star" iconFilled color="#F59F00" />
          <StatCard label="Difíceis" value={stats.weak} icon="warning" color="#ac2b2f" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Precisão por grupo</h2>
          <div className="space-y-3">
            {groupStats.map(g => (
              <div key={g.group}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{KANA_GROUP_LABELS[g.group]}</span>
                  <span className="font-medium text-foreground">
                    {g.attempts > 0 ? `${g.correct}/${g.attempts} — ${g.accuracy}%` : 'Sem dados'}
                  </span>
                </div>
                <ProgressBar value={g.accuracy} color={getAccuracyColor(g.accuracy)} />
              </div>
            ))}
          </div>
        </div>

        <AdPlaceholder slot="banner" />

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">Resetar progresso de kana</p>
              <p className="text-xs text-[--color-text-secondary] mt-0.5">Remove apenas o histórico de tentativas de kana, sem afetar vocabulário ou simulados.</p>
            </div>
            <div className="flex items-center gap-2">
              {confirmReset && (
                <button
                  onClick={() => setConfirmReset(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
                  data-testid="cancel-reset-kana-progress-btn"
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
                data-testid="reset-kana-progress-btn"
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
