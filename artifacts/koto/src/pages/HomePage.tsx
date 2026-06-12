import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BookOpen, Target, FileText, Globe } from 'lucide-react';
import { PingoMascot } from '../components/brand/PingoMascot';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getProgressSummary } from '../services/progress/progress.local';

const features = [
  {
    icon: Target,
    title: 'Treinos curtos',
    desc: 'Sessões de 5 a 15 minutos. Sem pressão, sem tempo perdido.',
    color: '#E5484D',
  },
  {
    icon: BookOpen,
    title: 'Progresso claro',
    desc: 'Acompanhe seus acertos, erros e evolução ao longo do tempo.',
    color: '#7C3AED',
  },
  {
    icon: FileText,
    title: 'Simulados organizados',
    desc: 'Questões no formato JLPT. Do N5 ao N1, no seu ritmo.',
    color: '#EA580C',
  },
  {
    icon: Globe,
    title: 'Feito para brasileiros',
    desc: 'Todo o conteúdo em português. Sem adaptações questionáveis.',
    color: '#0284C7',
  },
];

export function HomePage() {
  useEffect(() => {
    updatePageSEO(
      'Koto by Pingo — Treine japonês com kana, vocabulário e simulados',
      'Treine japonês em sessões rápidas com kana, vocabulário, escuta, progresso e simulados estilo JLPT. Feito para brasileiros.'
    );
  }, []);

  const summary = getProgressSummary();
  const hasProgress = summary.totalAttempts > 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <span>Koto by Pingo</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                Japonês em pequenos treinos diários.
              </h1>
              <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                Treine kana, vocabulário, escuta e simulados com uma rotina simples, clara e progressiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/kana"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  data-testid="hero-cta-kana"
                >
                  Começar pelo Kana
                </Link>
                <Link
                  href="/simulados"
                  className="px-6 py-3 border border-border text-foreground rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
                  data-testid="hero-cta-simulados"
                >
                  Ver Simulados
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <PingoMascot variant="kana" size="xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Continue studying - only shown when there's progress */}
      {hasProgress && (
        <section className="bg-accent/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Continue estudando</h2>
            <div className="flex flex-wrap gap-3">
              {summary.kanaTotal > 0 && (
                <Link href="/kana" className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted transition-colors" data-testid="continue-kana">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">Kana</span>
                  <span className="text-muted-foreground">{summary.kanaAccuracy}% precisão</span>
                </Link>
              )}
              {summary.vocabTotal > 0 && (
                <Link href="/vocabulario" className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted transition-colors" data-testid="continue-vocab">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#7C3AED' }} />
                  <span className="text-foreground font-medium">Vocabulário</span>
                  <span className="text-muted-foreground">{summary.vocabAccuracy}% precisão</span>
                </Link>
              )}
              {summary.examsCompleted > 0 && (
                <Link href="/progresso" className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm hover:bg-muted transition-colors" data-testid="continue-progress">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#16A34A' }} />
                  <span className="text-foreground font-medium">{summary.examsCompleted} simulado{summary.examsCompleted !== 1 ? 's' : ''} feito{summary.examsCompleted !== 1 ? 's' : ''}</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-xl font-bold text-foreground mb-2">Por que Koto?</h2>
          <p className="text-sm text-muted-foreground mb-8">Uma ferramenta construída com clareza, sem distrações.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="bg-card border border-card-border rounded-xl p-5 flex items-start gap-4"
                  data-testid={`feature-card-${i}`}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: f.color + '18' }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad placeholder */}
      <section className="bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <AdPlaceholder slot="banner" />
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-foreground mb-3">
              Aprenda japonês com método e consistência
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              O Koto by Pingo é uma plataforma gratuita de treino de japonês desenvolvida para estudantes brasileiros.
              Nosso foco é a progressão estruturada: você começa pelo kana, avança para o vocabulário e,
              quando estiver pronto, enfrenta simulados no formato do exame JLPT.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada sessão é curta e objetiva. Sem longos vídeos, sem cursos infinitos. Apenas prática
              direta com feedback imediato, progresso registrado e o Pingo-sensei guiando cada etapa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
