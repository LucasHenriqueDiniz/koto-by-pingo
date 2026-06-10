import { Link } from 'wouter';
import type { Exam, Question } from '../../types/exams';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { getAccuracyLabel } from '../../utils/scoring';
import { PingoMascot } from '../brand/PingoMascot';

interface ResultSummaryProps {
  exam: Exam;
  questions: Question[];
  answers: Record<string, string>;
  correct: number;
  onRetry: () => void;
}

export function ResultSummary({ exam, questions, answers, correct, onRetry }: ResultSummaryProps) {
  const accuracy = Math.round((correct / questions.length) * 100);
  const label = getAccuracyLabel(accuracy);

  const getMessage = () => {
    if (accuracy >= 90) return 'Resultado sólido. Você está no caminho certo.';
    if (accuracy >= 70) return 'Bom desempenho. Revise os pontos marcados abaixo.';
    if (accuracy >= 50) return 'Progresso razoável. Concentre-se nos erros.';
    return 'Continue estudando. Revise o material e tente novamente.';
  };

  return (
    <div className="space-y-8" data-testid="result-summary">
      {/* Score card */}
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
        <PingoMascot variant="progress" size="md" className="mx-auto" />
        <div>
          <span className="text-5xl font-bold text-foreground">{accuracy}%</span>
          <p className="text-muted-foreground text-sm mt-1">{label}</p>
        </div>
        <p className="text-sm text-foreground">
          {correct} de {questions.length} questões corretas
        </p>
        <p className="text-sm text-muted-foreground italic">{getMessage()}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          data-testid="result-retry-btn"
        >
          Tentar novamente
        </button>
        <Link href="/simulados" className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center" data-testid="result-back-btn">
          Ver simulados
        </Link>
      </div>

      {/* Answer review */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Revisão das respostas</h3>
        {questions.map((q, i) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground mb-2">Questão {i + 1}</p>
            <MultipleChoiceQuestion
              question={q}
              selectedOptionId={answers[q.id] ?? null}
              onSelect={() => {}}
              showResult
            />
          </div>
        ))}
      </div>
    </div>
  );
}
