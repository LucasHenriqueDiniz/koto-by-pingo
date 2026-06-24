import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { mockExams } from '../data/mockExams';
import type { Section } from '../types/exams';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getExamAttempts } from '../services/progress/progress.local';

const ALL_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
const LEVEL_NAMES: Record<string, string> = {
  N5: 'Básico', N4: 'Elementar', N3: 'Intermediário', N2: 'Pré-Avançado', N1: 'Avançado',
};
const SECTION_ICONS: Record<Section['type'], MaterialIconName> = {
  vocabulary: 'menu_book',
  grammar: 'rule',
  reading: 'article',
  listening: 'hearing',
};

export function ExamsPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    updatePageSEO('Simulados JLPT', 'Simulados no formato JLPT N5, N4 e mais. Teste seu nível com questões organizadas por seção.');
  }, []);

  const attempts = getExamAttempts();
  const sorted = [...attempts].sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.correctAnswers / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;

  const examsByLevel = (level: string) => mockExams.filter(e => e.level === level);
  const currentLevel = ALL_LEVELS.find(lv => examsByLevel(lv).length > 0) ?? 'N5';

  return (
    <div>
      <PageHeader title="Simulados JLPT" description="Teste seu nível com questões no formato oficial." />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
        {/* Hero */}
        <section className="relative overflow-hidden bg-foreground rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-center gap-7">
          <div className="absolute -right-3 -top-5 opacity-[0.05] pointer-events-none select-none text-background font-japanese">
            <span className="text-[220px] font-bold leading-none">試</span>
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="bg-primary text-primary-foreground text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">Simulado Oficial</span>
              <span className="bg-background/10 text-background/70 text-[11px] font-semibold px-2.5 py-1 rounded-full">Formato JLPT real</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-background mb-2">Teste seus conhecimentos</h2>
            <p className="text-sm text-background/60 leading-relaxed max-w-md">
              Simulados baseados no formato oficial do JLPT com seções de vocabulário, gramática, leitura e escuta.
            </p>
          </div>
          <div className="flex gap-5 relative z-10 flex-shrink-0">
            <div className="text-center">
              <div className="font-heading text-2xl font-extrabold text-background">{attempts.length}</div>
              <div className="text-[11px] text-background/50 uppercase tracking-wider mt-0.5">Simulados feitos</div>
            </div>
            <div className="w-px bg-background/10" />
            <div className="text-center">
              <div className="font-heading text-2xl font-extrabold text-primary">{avgScore}%</div>
              <div className="text-[11px] text-background/50 uppercase tracking-wider mt-0.5">Média geral</div>
            </div>
            <div className="w-px bg-background/10" />
            <div className="text-center">
              <div className="font-heading text-2xl font-extrabold text-background">{currentLevel}</div>
              <div className="text-[11px] text-background/50 uppercase tracking-wider mt-0.5">Nível atual</div>
            </div>
          </div>
        </section>

        {/* Exam cards */}
        <section>
          <h3 className="font-heading text-lg font-bold text-foreground mb-4">Escolha um simulado</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_LEVELS.map(level => {
              const levelExams = examsByLevel(level);
              const available = levelExams.length > 0;
              const exam = levelExams[0];
              const recommended = level === 'N5';
              const totalQuestions = exam?.sections.reduce((sum, s) => sum + s.questions.length, 0) ?? 0;

              return (
                <div
                  key={level}
                  className={`bg-card border rounded-2xl p-6 flex flex-col ${recommended ? 'border-2 border-primary' : 'border-border'} ${!available && 'opacity-60'}`}
                  data-testid={`exam-level-${level}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`font-heading text-3xl font-extrabold leading-none block ${available ? 'text-primary' : 'text-muted-foreground'}`}>{level}</span>
                      <span className="text-sm text-[--color-text-secondary] font-semibold">{LEVEL_NAMES[level]}</span>
                    </div>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${available ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <MaterialIcon name="assignment" filled size={22} />
                    </div>
                  </div>

                  {available && exam ? (
                    <>
                      <div className="flex flex-col gap-2 mb-4">
                        {exam.sections.map(sec => (
                          <div key={sec.id} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-[--color-text-secondary]">
                              <MaterialIcon name={SECTION_ICONS[sec.type]} size={15} className="text-muted-foreground" />
                              {sec.title}
                            </span>
                            <span className="text-muted-foreground font-semibold">{sec.timeLimitMinutes ?? '—'} min</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-background rounded-lg mb-4 text-xs text-[--color-text-secondary]">
                        <MaterialIcon name="schedule" size={16} />
                        <span className="font-semibold text-foreground">{exam.estimatedMinutes} min no total</span>
                        <span className="ml-auto">{totalQuestions} questões</span>
                      </div>
                      <button
                        onClick={() => setLocation(`/simulados/${exam.slug}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors mt-auto"
                      >
                        Iniciar agora <MaterialIcon name="arrow_forward" size={18} />
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-[--color-text-secondary] mt-auto">Em breve</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <AdPlaceholder slot="banner" />

        {/* Histórico */}
        {sorted.length > 0 && (
          <section>
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Histórico de simulados</h3>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-0 px-5 py-2.5 border-b border-border/60 text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-wider">
                <span>Simulado</span><span>Data</span><span>Resultado</span><span>Tempo</span>
              </div>
              {sorted.slice(0, 8).map(a => {
                const exam = mockExams.find(e => e.id === a.examId);
                const date = a.completedAt ? new Date(a.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                const score = Math.round((a.correctAnswers / a.totalQuestions) * 100);
                return (
                  <div key={a.id} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-0 px-5 py-4 border-b border-border/40 items-center hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="font-heading text-base font-extrabold text-primary">{exam?.level ?? '—'}</span>
                      <span className="text-sm font-semibold text-foreground">Simulado</span>
                    </div>
                    <span className="text-sm text-[--color-text-secondary]">{date}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-[hsl(var(--tertiary))] rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-[hsl(var(--tertiary))]">{score}%</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{a.correctAnswers}/{a.totalQuestions}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
