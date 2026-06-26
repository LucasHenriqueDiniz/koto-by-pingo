import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { Card, CardContent } from '@/components/ui/card';

export interface StudyMode {
  id: string;
  label: string;
  icon: string;
}

const modes: StudyMode[] = [
  { id: 'typing', label: 'Typing', icon: 'edit' },
  { id: 'flashcards', label: 'Flashcards', icon: 'collections' },
  { id: 'quiz', label: 'Quiz', icon: 'quiz' },
  { id: 'listening', label: 'Listening', icon: 'headphones' },
  { id: 'matching', label: 'Matching', icon: 'shuffle' },
  { id: 'word_builder', label: 'Word Builder', icon: 'construction' },
  { id: 'tracing', label: 'Tracing', icon: 'draw' },
];

export interface StudyModesGridProps {
  className?: string;
}

export function StudyModesGrid({ className = '' }: StudyModesGridProps) {
  return (
    <div className={`grid grid-cols-4 md:grid-cols-7 gap-3 ${className}`}>
      {modes.map((mode) => (
        <Card key={mode.id} className="border-2 hover:border-primary transition-colors">
          <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
            <MaterialIcon
              name={mode.icon}
              className="text-2xl text-primary"
            />
            <p className="text-xs font-medium text-foreground">{mode.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
