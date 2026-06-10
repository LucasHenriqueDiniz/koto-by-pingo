import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { ProgressBar } from '../ui/ProgressBar';
import type { Question } from '../../types/exams';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  isLastQuestion?: boolean;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelect,
  onNext,
  isLastQuestion = false,
}: QuizCardProps) {
  return (
    <div className="flex flex-col gap-5" data-testid="quiz-card">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Questão {questionNumber} de {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <ProgressBar value={questionNumber} max={totalQuestions} />
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <MultipleChoiceQuestion
          question={question}
          selectedOptionId={selectedOptionId}
          onSelect={onSelect}
        />
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!selectedOptionId}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity"
        data-testid="quiz-next-btn"
      >
        {isLastQuestion ? 'Finalizar Simulado' : 'Próxima Questão'}
      </button>
    </div>
  );
}
