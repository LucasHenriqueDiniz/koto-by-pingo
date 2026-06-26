import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface MockQuizCardProps {
  question: string;
  options: string[];
  correctIndex?: number;
  kanaCharacter?: string;
}

export function MockQuizCard({
  question,
  options,
  correctIndex = 0,
  kanaCharacter = '「か」',
}: MockQuizCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          {kanaCharacter && (
            <div className="text-4xl font-bold text-primary">{kanaCharacter}</div>
          )}
          <CardTitle className="text-lg">{question}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={index === correctIndex ? 'default' : 'outline'}
            className={`w-full h-10 text-base font-medium transition-all ${
              index === correctIndex
                ? 'border-tertiary bg-tertiary text-white hover:bg-tertiary hover:border-tertiary'
                : ''
            }`}
            disabled
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
