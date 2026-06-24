import { useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { updatePageSEO } from '../utils/seo';

/**
 * Aulas Extras — material complementar (estilo Cure Dolly) para entender a
 * estrutura real do japonês. ⚠️ Placeholder visual: o conteúdo em vídeo/aula
 * ainda não existe (ver docs/TODO_AULAS_EXTRAS.md).
 */

interface Lesson {
  num: string;
  title: string;
  subtitle: string;
}

interface Chapter {
  num: string;
  title: string;
  icon: MaterialIconName;
  iconClass: string;
  lessons: Lesson[];
}

const chapters: Chapter[] = [
  {
    num: 'Capítulo 01',
    title: 'A estrutura real do japonês',
    icon: 'foundation',
    iconClass: 'bg-accent text-primary',
    lessons: [
      { num: '01', title: 'O motor da frase', subtitle: 'Por que tudo gira em torno de が (ga)' },
      { num: '02', title: 'は não é o sujeito', subtitle: 'Desfazendo o maior mito do japonês' },
      { num: '03', title: 'O が invisível', subtitle: 'Como toda frase tem um sujeito oculto' },
    ],
  },
  {
    num: 'Capítulo 02',
    title: 'Partículas essenciais',
    icon: 'merge',
    iconClass: 'bg-muted text-[--color-text-secondary]',
    lessons: [
      { num: '04', title: 'を e o objeto direto', subtitle: 'O alvo da ação' },
      { num: '05', title: 'に vs で', subtitle: 'Lugar de existência vs lugar de ação' },
      { num: '06', title: 'の e a posse', subtitle: 'Conectando substantivos' },
    ],
  },
  {
    num: 'Capítulo 03',
    title: 'Verbos e adjetivos como motores',
    icon: 'bolt',
    iconClass: 'bg-muted text-[--color-text-secondary]',
    lessons: [
      { num: '07', title: 'Verbos う e る', subtitle: 'As duas famílias e por que importam' },
      { num: '08', title: 'Adjetivos い são verbos', subtitle: 'A lógica escondida' },
      { num: '09', title: 'A forma て', subtitle: 'A conexão que liga tudo' },
    ],
  },
];

export function AulasExtrasPage() {
  useEffect(() => {
    updatePageSEO(
      'Aulas Extras',
      'Material complementar para entender a estrutura real do japonês — assista no seu ritmo, sem pressão.',
    );
  }, []);

  return (
    <div>
      <PageHeader title="Aulas Extras" description="Entenda a estrutura real do japonês, no seu ritmo." />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
        {/* Intro */}
        <section className="relative overflow-hidden bg-foreground rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute -right-4 -top-6 opacity-[0.05] pointer-events-none select-none text-background font-japanese">
            <span className="text-[200px] font-bold leading-none">学</span>
          </div>
          <div className="flex-1 relative z-10">
            <span className="inline-block bg-primary text-primary-foreground text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3">
              Em breve
            </span>
            <h2 className="font-heading text-2xl font-bold text-background mb-2">Material complementar</h2>
            <p className="text-sm text-background/60 leading-relaxed max-w-lg">
              Uma trilha de aulas para entender a lógica por trás do japonês — partículas, verbos e a verdadeira
              estrutura das frases. Assista no seu ritmo, sem pressão. O conteúdo está sendo preparado.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0 text-center">
            <div className="font-heading text-2xl font-extrabold text-primary">0%</div>
            <div className="text-[11px] text-background/50 uppercase tracking-wider mt-0.5">Progresso geral</div>
          </div>
        </section>

        {/* Chapters (placeholder, locked) */}
        <section className="space-y-5">
          {chapters.map(ch => (
            <div key={ch.num} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ch.iconClass}`}>
                    <MaterialIcon name={ch.icon} filled size={24} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-wider mb-0.5">{ch.num}</div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{ch.title}</h3>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[--color-text-secondary] bg-background border border-border px-3.5 py-1.5 rounded-full">
                  <MaterialIcon name="lock" size={18} />
                  Bloqueado
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {ch.lessons.map(lesson => (
                  <div key={lesson.num} className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl border border-border/60">
                    <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center font-heading font-extrabold text-xs text-foreground flex-shrink-0">
                      {lesson.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground">{lesson.title}</div>
                      <div className="text-xs text-[--color-text-secondary] mt-0.5">{lesson.subtitle}</div>
                    </div>
                    <MaterialIcon name="lock" size={20} className="text-border flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <p className="text-center text-xs text-[--color-text-secondary] pb-2">
          As aulas extras estão em produção. Enquanto isso, continue treinando kana e vocabulário.
        </p>
      </div>
    </div>
  );
}
