import { useEffect, useState } from 'react';
import { Target, BookOpen, Headphones, FileText, RotateCcw } from 'lucide-react';
import { useStudyProgress } from '../hooks/useStudyProgress';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PageHeader } from '../components/ui/PageHeader';
import { PingoMascot } from '../components/brand/PingoMascot';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { allKana } from '../data/kana';

export function DashboardPage() {
  const { summary, refresh, reset } = useStudyProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    updatePageSEO('Progresso', 'Acompanhe seu progresso nos estudos de japonês: kana, vocabulário e simulados.');
    refresh();
  }, [refresh]);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    reset();
    setConfirmReset(false);
  };

  const isEmpty = summary.totalAttempts === 0 && summary.examsCompleted === 0;

  const topMistakeLabels = summary.topMistakes
    .map(m => {
      const kana = allKana.find(k => k.id === m.kanaId);
      return kana ? `${kana.character} (${kana.romaji}) ×${m.count}` : null;
    })
    .filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Progresso"
        description="Acompanhe sua evolução nos estudos."
        color="#16A34A"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <PingoMascot variant="progress" size="lg" />
            <div>
              <p className="text-base font-medium text-foreground">Nenhum treino registrado.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Você ainda não iniciou nenhum treino. Comece com kana para criar sua base.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Sessões"
                value={summary.sessionsCount}
                icon={Target}
                color="#16A34A"
              />
              <StatCard
                label="Tentativas"
                value={summary.totalAttempts}
                icon={BookOpen}
                color="#7C3AED"
              />
              <StatCard
                label="Precisão geral"
                value={`${summary.overallAccuracy}%`}
                icon={Target}
                color="#E5484D"
              />
              <StatCard
                label="Simulados"
                value={summary.examsCompleted}
                icon={FileText}
                color="#EA580C"
              />
            </div>

            {/* Module breakdown */}
            <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Por módulo</h2>

              {summary.kanaTotal > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E5484D', display: 'inline-block' }} />
                      Kana
                    </span>
                    <span className="text-muted-foreground">{summary.kanaCorrect}/{summary.kanaTotal} — {summary.kanaAccuracy}%</span>
                  </div>
                  <ProgressBar value={summary.kanaAccuracy} color="#E5484D" />
                </div>
              )}

              {summary.vocabTotal > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#7C3AED' }} />
                      Vocabulário
                    </span>
                    <span className="text-muted-foreground">{summary.vocabCorrect}/{summary.vocabTotal} — {summary.vocabAccuracy}%</span>
                  </div>
                  <ProgressBar value={summary.vocabAccuracy} color="#7C3AED" />
                </div>
              )}

              {summary.kanaTotal === 0 && summary.vocabTotal === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma atividade de treino registrada ainda.</p>
              )}
            </div>

            {/* Top mistakes */}
            {topMistakeLabels.length > 0 && (
              <div className="bg-card border border-card-border rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Kana com mais erros</h2>
                <div className="flex flex-wrap gap-2">
                  {topMistakeLabels.map((label, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: '#FFE5E7', color: '#B4232A', fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Pratique esses caracteres com mais frequência.
                </p>
              </div>
            )}

            {/* Pingo message */}
            <div className="flex items-end gap-3">
              <PingoMascot variant="progress" size="sm" />
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-foreground shadow-sm">
                {summary.overallAccuracy >= 80
                  ? 'Boa sequência. Mantenha o ritmo.'
                  : summary.overallAccuracy >= 50
                  ? 'Progresso registrado. Continue praticando.'
                  : 'Consistência é o caminho. Pratique um pouco todos os dias.'}
              </div>
            </div>

            {/* Reset */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Resetar progresso</p>
                  <p className="text-xs text-muted-foreground">Remove todos os dados de treino armazenados.</p>
                </div>
                <button
                  onClick={handleReset}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    confirmReset
                      ? 'bg-destructive text-destructive-foreground'
                      : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  data-testid="reset-progress-btn"
                >
                  <RotateCcw size={14} />
                  {confirmReset ? 'Confirmar reset' : 'Resetar'}
                </button>
              </div>
              {confirmReset && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10">
          <AdPlaceholder slot="banner" />
        </div>
      </div>
    </div>
  );
}
