import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { getExamBySlug, getAllQuestions } from '../data/mockExams';
import { submitExam } from '../services/exams/exams.local';
import { QuizCard } from '../components/quiz/QuizCard';
import { ResultSummary } from '../components/quiz/ResultSummary';
import { ModuleBadge } from '../components/ui/ModuleBadge';
import { updatePageSEO } from '../utils/seo';
import type { Question } from '../types/exams';

type Phase = 'intro' | 'quiz' | 'result';

export function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const exam = getExamBySlug(slug ?? '');

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: number } | null>(null);

  useEffect(() => {
    if (exam) {
      updatePageSEO(exam.title, `Simulado ${exam.title} — ${exam.sections.reduce((s, sec) => s + sec.questions.length, 0)} questões nível ${exam.level}.`);
    }
  }, [exam]);

  if (!exam) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Simulado não encontrado.</p>
        <button onClick={() => setLocation('/simulados')} className="mt-4 text-primary text-sm">
          Ver simulados
        </button>
      </div>
    );
  }

  const totalQuestions = exam.sections.reduce((s, sec) => s + sec.questions.length, 0);

  const handleStart = () => {
    const qs = getAllQuestions(exam);
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setPhase('quiz');
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 >= questions.length) {
      const res = submitExam(exam, newAnswers);
      setResult({ correct: res.correctAnswers });
      setPhase('result');
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleRetry = () => {
    setPhase('intro');
    setAnswers({});
    setSelectedOption(null);
    setCurrentIndex(0);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => setLocation('/simulados')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-testid="exam-back-btn"
      >
        <MaterialIcon name="arrow_back" size={16} />
        Todos os simulados
      </button>

      <div className="max-w-lg mx-auto">
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ModuleBadge module={exam.level} />
              </div>
              <h1 className="text-xl font-bold text-foreground">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">{exam.description}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t border-border">
                <span className="flex items-center gap-1.5">
                  <MaterialIcon name="schedule" size={16} />
                  {exam.estimatedMinutes} minutos
                </span>
                <span>{totalQuestions} questões</span>
                <span>{exam.sections.length} {exam.sections.length === 1 ? 'seção' : 'seções'}</span>
              </div>
              <div className="space-y-2">
                {exam.sections.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                    <span>{s.title}</span>
                    <span>{s.questions.length} questões</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold"
              data-testid="exam-start-btn"
            >
              Iniciar Simulado
            </button>
          </div>
        )}

        {phase === 'quiz' && questions.length > 0 && (
          <QuizCard
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedOptionId={selectedOption}
            onSelect={setSelectedOption}
            onNext={handleNext}
            isLastQuestion={currentIndex + 1 === questions.length}
          />
        )}

        {phase === 'result' && result && (
          <ResultSummary
            exam={exam}
            questions={questions}
            answers={answers}
            correct={result.correct}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
