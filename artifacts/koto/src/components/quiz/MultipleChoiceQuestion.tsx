import type { Question } from '../../types/exams';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  showResult?: boolean;
}

export function MultipleChoiceQuestion({ question, selectedOptionId, onSelect, showResult = false }: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-4" data-testid="mcq-question">
      {/* Prompt */}
      <div className="space-y-2">
        <p className="text-base font-medium text-foreground">{question.prompt}</p>
        {question.japaneseText && (
          <div className="text-3xl font-medium py-3 text-center" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
            {question.japaneseText}
            {question.reading && (
              <p className="text-sm text-muted-foreground mt-1">{question.reading}</p>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = option.id === selectedOptionId;
          const isCorrect = option.id === question.correctOptionId;
          let cls = 'border-border bg-card text-foreground';
          if (showResult) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-60';
          } else if (isSelected) {
            cls = 'border-primary bg-accent text-foreground';
          } else {
            cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          }
          const labels = ['A', 'B', 'C', 'D'];
          return (
            <button
              key={option.id}
              onClick={() => !showResult && onSelect(option.id)}
              disabled={showResult}
              className={`w-full flex items-center gap-3 border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${cls}`}
              data-testid={`mcq-option-${option.id}`}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                {labels[i]}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className="bg-muted rounded-xl px-4 py-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Explicação: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
