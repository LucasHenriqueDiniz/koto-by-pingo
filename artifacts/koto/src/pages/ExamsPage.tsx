import { useEffect } from 'react';
import { Link } from 'wouter';
import { Clock, ChevronRight } from 'lucide-react';
import { mockExams } from '../data/mockExams';
import { ModuleBadge } from '../components/ui/ModuleBadge';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import { getExamAttempts } from '../services/progress/progress.local';

export function ExamsPage() {
  useEffect(() => {
    updatePageSEO('Simulados JLPT', 'Simulados no formato JLPT N5, N4 e mais. Teste seu nível com questões organizadas por seção.');
  }, []);

  const attempts = getExamAttempts();

  const getAttemptsForExam = (id: string) =>
    attempts.filter(a => a.examId === id);

  return (
    <div>
      <PageHeader
        title="Simulados"
        description="Questões no formato JLPT. Teste seu nível."
        color="#EA580C"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-4 max-w-2xl">
          {mockExams.map(exam => {
            const examAttempts = getAttemptsForExam(exam.id);
            const lastAttempt = examAttempts[examAttempts.length - 1];
            const totalQuestions = exam.sections.reduce((sum, s) => sum + s.questions.length, 0);

            return (
              <div
                key={exam.id}
                className="bg-card border border-card-border rounded-2xl p-5 hover:border-border/60 transition-colors"
                data-testid={`exam-card-${exam.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ModuleBadge module={exam.level} />
                      <span className="text-xs text-muted-foreground">
                        {totalQuestions} questões
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-foreground mb-1">{exam.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{exam.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {exam.estimatedMinutes} min
                      </span>
                      {lastAttempt && (
                        <span>
                          Melhor: {Math.round((lastAttempt.correctAnswers / lastAttempt.totalQuestions) * 100)}%
                        </span>
                      )}
                      {examAttempts.length > 0 && (
                        <span>{examAttempts.length} tentativa{examAttempts.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/simulados/${exam.slug}`}
                    className="flex-shrink-0 flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    data-testid={`exam-start-${exam.id}`}
                  >
                    Iniciar
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-5 bg-muted/30 border border-border rounded-xl max-w-2xl">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Em breve:</strong> simulados N3, N2 e N1 com seções de gramática, leitura e escuta completas.
          </p>
        </div>

        <div className="mt-8">
          <AdPlaceholder slot="banner" />
        </div>
      </div>
    </div>
  );
}
