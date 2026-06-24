import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useStudyProgress } from '../hooks/useStudyProgress';
import { PageHeader } from '../components/ui/PageHeader';
import { AchievementBadge } from '../components/ui/AchievementBadge';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { WeeklyActivityChart } from '../components/progress/WeeklyActivityChart';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { SyncProgressBanner } from '../components/ui/SyncProgressBanner';
import { updatePageSEO } from '../utils/seo';
import { getKanaByScript, getKanaByGroup } from '../data/kana';
import {
  getKanaStatsMap,
  getVocabStats,
  getWeeklyActivity,
  getActivityHeatmap,
  getWeakKana,
} from '../services/progress/progress.local';
import type { KanaScript } from '../types/kana';

type Mastery = 'mastered' | 'learning' | 'new';

function classify(attempts: number, correct: number): Mastery {
  if (attempts === 0) return 'new';
  if (attempts >= 5 && correct / attempts >= 0.85) return 'mastered';
  return 'learning';
}

const HEATMAP_COLORS = ['bg-border', 'bg-[#d5e5f5]', 'bg-[#94b8d9]', 'bg-[#4080ad]', 'bg-foreground'];

export function DashboardPage() {
  const { summary, refresh, reset } = useStudyProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [kanaSet, setKanaSet] = useState<KanaScript>('hiragana');

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

  const basicKana = useMemo(() => getKanaByGroup(getKanaByScript(kanaSet), 'basic'), [kanaSet]);
  const statsMap = getKanaStatsMap();
  const masteredCount = basicKana.filter(k => classify(statsMap[k.id]?.attempts ?? 0, statsMap[k.id]?.correct ?? 0) === 'mastered').length;
  const learningCount = basicKana.filter(k => classify(statsMap[k.id]?.attempts ?? 0, statsMap[k.id]?.correct ?? 0) === 'learning').length;
  const masteryPct = basicKana.length > 0 ? Math.round((masteredCount / basicKana.length) * 100) : 0;

  const weekly = getWeeklyActivity();
  const weeklyTotal = weekly.reduce((sum, d) => sum + d.count, 0);
  const heatmap = getActivityHeatmap(10);
  const vocabStats = getVocabStats();
  const weakKanaIds = getWeakKana(basicKana.map(k => k.id), 4);
  const nextReviews = weakKanaIds.map(id => basicKana.find(k => k.id === id)).filter((k): k is NonNullable<typeof k> => !!k);

  if (isEmpty) {
    return (
      <div>
        <PageHeader title="Progresso" description="Acompanhe sua evolução nos estudos." />
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            <MaterialIcon name="trending_up" size={32} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Nenhum treino registrado.</p>
            <p className="text-sm text-[--color-text-secondary] mt-1">
              Comece com kana para criar sua base, depois passe para vocabulário e simulados.
            </p>
          </div>
          <Link href="/kana/treinar" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            <MaterialIcon name="bolt" filled size={18} /> Começar agora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Progresso" description="Acompanhe sua evolução nos estudos.">
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-card border border-border rounded-full">
          <MaterialIcon name="local_fire_department" filled size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">0</span>
          <span className="text-xs text-[--color-text-secondary]">dias</span>
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <SyncProgressBanner hasLocalProgress={!isEmpty} />

        {/* Stats row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Streak — PLACEHOLDER (ver docs/TODO_GAMIFICATION.md) */}
          <div className="bg-accent border border-primary/20 rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-2xl leading-none">🔥</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-heading text-2xl font-extrabold text-foreground">0</span>
              <span className="text-xs font-semibold text-[--color-text-secondary]">dias</span>
            </div>
            <span className="text-xs font-semibold text-[--color-text-secondary]">Sequência ativa</span>
            <span className="text-[11px] text-[--color-text-secondary] mt-1">Em breve</span>
          </div>

          {/* Kana dominados — REAL */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-2xl leading-none">✅</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-heading text-2xl font-extrabold text-foreground">{masteredCount}</span>
              <span className="text-xs font-semibold text-[--color-text-secondary]">/{basicKana.length} kana</span>
            </div>
            <span className="text-xs font-semibold text-[--color-text-secondary]">Kana dominados</span>
            <span className="text-[11px] font-semibold text-[hsl(var(--tertiary))] mt-1">{masteryPct}% do total completo</span>
          </div>

          {/* Vocabulário — REAL */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-2xl leading-none">📚</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-heading text-2xl font-extrabold text-foreground">{vocabStats.mastered}</span>
              <span className="text-xs font-semibold text-[--color-text-secondary]">/{vocabStats.total} palavras</span>
            </div>
            <span className="text-xs font-semibold text-[--color-text-secondary]">Vocabulário dominado</span>
            <span className="text-[11px] font-semibold text-[hsl(var(--tertiary))] mt-1">{vocabStats.seen} já vistas</span>
          </div>

          {/* Atividade da semana — REAL */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-2xl leading-none">⏱</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-heading text-2xl font-extrabold text-foreground">{weeklyTotal}</span>
              <span className="text-xs font-semibold text-[--color-text-secondary]">tentativas</span>
            </div>
            <span className="text-xs font-semibold text-[--color-text-secondary]">Esta semana</span>
            <span className="text-[11px] text-[--color-text-secondary] mt-1">Kana + vocabulário</span>
          </div>
        </section>

        {/* Kana mastery + right column */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 items-start">
          {/* Kana mastery grid */}
          <div className="bg-card border border-border rounded-2xl p-7">
            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h2 className="font-heading text-base font-bold text-foreground mb-0.5">Domínio de Kana</h2>
                <p className="text-xs text-[--color-text-secondary]">
                  {masteredCount} de {basicKana.length} dominados · {masteryPct}% completo
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setKanaSet('hiragana')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    kanaSet === 'hiragana' ? 'bg-foreground text-background' : 'bg-card border border-border text-[--color-text-secondary] font-medium'
                  }`}
                >
                  あ Hiragana
                </button>
                <button
                  onClick={() => setKanaSet('katakana')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    kanaSet === 'katakana' ? 'bg-foreground text-background' : 'bg-card border border-border text-[--color-text-secondary] font-medium'
                  }`}
                >
                  ア Katakana
                </button>
              </div>
            </div>

            <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${masteryPct}%`, background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--foreground)) 100%)' }}
              />
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {basicKana.map(k => {
                const s = statsMap[k.id];
                const state = classify(s?.attempts ?? 0, s?.correct ?? 0);
                const cellClass =
                  state === 'mastered'
                    ? 'bg-foreground border-foreground text-background'
                    : state === 'learning'
                    ? 'bg-accent border-[#fecaca] text-primary'
                    : 'bg-background border-border text-muted-foreground/40';
                return (
                  <div key={k.id} className={`rounded-lg border py-2 flex flex-col items-center gap-0.5 ${cellClass}`} title={k.romaji}>
                    <span className="font-japanese text-lg font-bold leading-none">{k.character}</span>
                    <span className="text-[9px] font-semibold opacity-60 tracking-wide uppercase">{k.romaji}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-5 mt-4 pt-3.5 border-t border-border flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-foreground" />
                <span className="text-xs text-[--color-text-secondary]">Dominado ({masteredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-accent border border-[#fecaca]" />
                <span className="text-xs text-[--color-text-secondary]">Aprendendo ({learningCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-background border border-border" />
                <span className="text-xs text-[--color-text-secondary]">Novo</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-heading text-sm font-bold text-foreground mb-0.5">Atividade semanal</h3>
              <p className="text-xs text-[--color-text-secondary] mb-4">{weeklyTotal} tentativas esta semana</p>
              <WeeklyActivityChart data={weekly} />
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-sm font-bold text-foreground">Próximas revisões</h3>
                <Link href="/kana/revisar" className="text-xs font-bold text-primary hover:underline">Ver todas →</Link>
              </div>
              {nextReviews.length === 0 ? (
                <p className="text-xs text-[--color-text-secondary]">Nenhum kana difícil agora. Bom trabalho!</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {nextReviews.map(k => {
                    const s = statsMap[k.id];
                    const acc = s && s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                    return (
                      <div key={k.id} className="flex items-center gap-2.5 px-3 py-2 bg-background rounded-lg border border-border/60">
                        <span className="font-japanese text-xl font-bold text-foreground w-7 text-center flex-shrink-0">{k.character}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{k.romaji}</p>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent text-primary flex-shrink-0">{acc}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Activity calendar */}
        <section className="bg-card border border-border rounded-2xl p-7">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <div>
              <h2 className="font-heading text-base font-bold text-foreground mb-0.5">Calendário de atividade</h2>
              <p className="text-xs text-[--color-text-secondary]">Últimas {heatmap.length} semanas</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[--color-text-secondary] mr-0.5">menos</span>
              {HEATMAP_COLORS.map(c => <span key={c} className={`w-3.5 h-3.5 rounded-[3px] ${c}`} />)}
              <span className="text-[11px] text-[--color-text-secondary] ml-0.5">mais</span>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            <div className="flex flex-col gap-1 mr-0.5 flex-shrink-0">
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                <div key={i} className="w-4 h-4 flex items-center justify-center text-[9px] font-semibold text-[--color-text-secondary]">{d}</div>
              ))}
            </div>
            {heatmap.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
                {week.map(day => {
                  const level = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count <= 3 ? 2 : day.count <= 6 ? 3 : 4;
                  return (
                    <div
                      key={day.date}
                      className={`w-4 h-4 rounded-[3px] ${HEATMAP_COLORS[level]} ${day.isToday ? 'ring-2 ring-primary' : ''}`}
                      title={`${day.date}: ${day.count} tentativas`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Achievements — PLACEHOLDER (ver docs/TODO_GAMIFICATION.md) */}
        <section className="bg-card border border-border rounded-2xl p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-base font-bold text-foreground mb-0.5">Conquistas</h2>
              <p className="text-xs text-[--color-text-secondary]">Em breve</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            <AchievementBadge icon="local_fire_department" label="Chama Viva" description="14 dias seguidos" locked />
            <AchievementBadge icon="bolt" label="Primeiros Passos" description="Vogais dominadas" locked />
            <AchievementBadge icon="menu_book" label="Vocabularista" description="47 palavras" locked />
            <AchievementBadge icon="assignment" label="1º Simulado" description="JLPT N5 completo" locked />
            <AchievementBadge icon="dark_mode" label="Coruja Noturna" description="Estudar após 23h" locked />
            <AchievementBadge icon="workspace_premium" label="Mestre Katakana" description="Dominar todos os 46" locked />
          </div>
        </section>

        <AdPlaceholder slot="banner" />

        {/* Reset */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Resetar progresso</p>
              <p className="text-xs text-[--color-text-secondary]">Remove todos os dados de treino do dispositivo.</p>
            </div>
            <div className="flex items-center gap-2">
              {confirmReset && (
                <button
                  onClick={() => setConfirmReset(false)}
                  className="text-xs text-[--color-text-secondary] hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmReset
                    ? 'bg-destructive text-destructive-foreground'
                    : 'border border-border text-[--color-text-secondary] hover:text-foreground hover:bg-muted'
                }`}
                data-testid="reset-progress-btn"
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
