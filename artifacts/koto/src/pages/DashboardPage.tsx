import { useEffect, useState } from 'react';
import { Target, BookOpen, FileText, RotateCcw, AlertTriangle, Star, Eye } from 'lucide-react';
import { useStudyProgress } from '../hooks/useStudyProgress';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PageHeader } from '../components/ui/PageHeader';
import { PingoMascot } from '../components/brand/PingoMascot';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { SyncProgressBanner } from '../components/ui/SyncProgressBanner';
import { updatePageSEO } from '../utils/seo';
import { allKana } from '../data/kana';
import { vocabulary } from '../data/vocabulary';

export function DashboardPage() {
  const { summary, refresh, reset } = useStudyProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    updatePageSEO('Progresso', 'Acompanhe seu progresso nos estudos de japonês: kana, vocabulário e simulados.');
    refresh();
  }, [refresh]);

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    reset();
    setConfirmReset(false);
  };

  const isEmpty = summary.totalAttempts === 0 && summary.examsCompleted === 0;
  const vs = summary.vocabStats;
  const ks = summary.kanaStats;

  const topMistakeLabels = summary.topMistakes
    .map(m => {
      const kana = allKana.find(k => k.id === m.kanaId);
      return kana ? { label: `${kana.character} (${kana.romaji})`, count: m.count } : null;
    })
    .filter(Boolean) as { label: string; count: number }[];

  const pingoMsg = () => {
    if (isEmpty) return 'Você ainda não iniciou nenhum treino. Comece pelo kana.';
    if (summary.overallAccuracy >= 80) return 'Boa sequência. Mantenha o ritmo.';
    if (summary.overallAccuracy >= 50) return 'Progresso registrado. Continue praticando.';
    return 'Consistência é o caminho. Pratique um pouco todos os dias.';
  };

  return (
    <div>
      <PageHeader
        title="Progresso"
        description="Acompanhe sua evolução nos estudos."
        color="#16A34A"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <PingoMascot variant="progress" size="lg" />
            <div>
              <p className="text-base font-medium text-foreground">Nenhum treino registrado.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comece com kana para criar sua base, depois passe para vocabulário e simulados.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <SyncProgressBanner hasLocalProgress={!isEmpty} />

            {/* Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Sessões" value={summary.sessionsCount} icon={Target} color="#16A34A" />
              <StatCard label="Tentativas" value={summary.totalAttempts} icon={BookOpen} color="#7C3AED" />
              <StatCard
                label="Precisão geral"
                value={`${summary.overallAccuracy}%`}
                icon={Target}
                color="#E5484D"
              />
              <StatCard label="Simulados" value={summary.examsCompleted} icon={FileText} color="#EA580C" />
            </div>

            {/* Kana + Vocab breakdowns side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kana */}
              {(summary.kanaTotal > 0 || ks.seen > 0) && (
                <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground">Kana</h2>
                  {summary.kanaTotal > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Precisão</span>
                        <span className="font-medium text-foreground">{summary.kanaCorrect}/{summary.kanaTotal} — {summary.kanaAccuracy}%</span>
                      </div>
                      <ProgressBar value={summary.kanaAccuracy} color="#E5484D" />
                    </div>
                  )}

                  {/* Per-character classification */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <Eye size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-base font-bold text-foreground">{ks.seen}</p>
                      <p className="text-xs text-muted-foreground">vistos</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <Star size={14} className="mx-auto mb-1" style={{ color: '#F59F00' }} />
                      <p className="text-base font-bold text-foreground">{ks.mastered}</p>
                      <p className="text-xs text-muted-foreground">dominados</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <AlertTriangle size={14} className="mx-auto mb-1" style={{ color: '#E5484D' }} />
                      <p className="text-base font-bold text-foreground">{ks.weak}</p>
                      <p className="text-xs text-muted-foreground">difíceis</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <BookOpen size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-base font-bold text-foreground">{ks.neverSeen}</p>
                      <p className="text-xs text-muted-foreground">não vistos</p>
                    </div>
                  </div>

                  {topMistakeLabels.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Mais erros:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {topMistakeLabels.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: '#FFE5E7', color: '#B4232A', fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            {m.label} ×{m.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vocabulary */}
              {(summary.vocabTotal > 0 || vs.seen > 0) && (
                <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground">Vocabulário</h2>

                  {summary.vocabTotal > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Precisão</span>
                        <span className="font-medium text-foreground">{summary.vocabCorrect}/{summary.vocabTotal} — {summary.vocabAccuracy}%</span>
                      </div>
                      <ProgressBar value={summary.vocabAccuracy} color="#7C3AED" />
                    </div>
                  )}

                  {/* Word-level stats */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <Eye size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-base font-bold text-foreground">{vs.seen}</p>
                      <p className="text-xs text-muted-foreground">vistas</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <Star size={14} className="mx-auto mb-1" style={{ color: '#F59F00' }} />
                      <p className="text-base font-bold text-foreground">{vs.mastered}</p>
                      <p className="text-xs text-muted-foreground">dominadas</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <AlertTriangle size={14} className="mx-auto mb-1" style={{ color: '#E5484D' }} />
                      <p className="text-base font-bold text-foreground">{vs.weak}</p>
                      <p className="text-xs text-muted-foreground">problemáticas</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5 text-center">
                      <BookOpen size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-base font-bold text-foreground">{vs.neverSeen}</p>
                      <p className="text-xs text-muted-foreground">não vistas</p>
                    </div>
                  </div>

                  {/* Erros por tipo */}
                  {(vs.weakReasonTotals.reading + vs.weakReasonTotals.meaning) > 0 && (
                    <div className="pt-1 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Tipo de erro:</p>
                      <div className="space-y-1">
                        {[
                          { key: 'reading', label: 'Leitura', color: '#E5484D' },
                          { key: 'meaning', label: 'Significado', color: '#7C3AED' },
                          { key: 'listening', label: 'Escuta', color: '#0284C7' },
                          { key: 'typing', label: 'Digitação', color: '#F59F00' },
                        ].map(t => {
                          const n = vs.weakReasonTotals[t.key as keyof typeof vs.weakReasonTotals];
                          if (!n) return null;
                          return (
                            <div key={t.key} className="flex items-center gap-2 text-xs">
                              <span className="w-16 text-muted-foreground flex-shrink-0">{t.label}</span>
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (n / Math.max(1, vs.weakReasonTotals.reading + vs.weakReasonTotals.meaning + vs.weakReasonTotals.listening + vs.weakReasonTotals.typing)) * 100)}%`,
                                    backgroundColor: t.color,
                                  }}
                                />
                              </div>
                              <span className="text-foreground font-medium w-4">{n}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pingo message */}
            <div className="flex items-end gap-3">
              <PingoMascot variant="progress" size="sm" />
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-foreground shadow-sm">
                {pingoMsg()}
              </div>
            </div>

            {/* Ad (after session, before reset) */}
            <AdPlaceholder slot="banner" />

            {/* Reset */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Resetar progresso</p>
                  <p className="text-xs text-muted-foreground">Remove todos os dados de treino do dispositivo.</p>
                </div>
                <div className="flex items-center gap-2">
                  {confirmReset && (
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
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
                    data-testid="reset-progress-btn"
                  >
                    <RotateCcw size={14} />
                    {confirmReset ? 'Confirmar reset' : 'Resetar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
