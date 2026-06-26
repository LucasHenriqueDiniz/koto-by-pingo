import { Card, CardContent } from '@/components/ui/card';

export interface VocabItem {
  character: string;
  romaji: string;
  meaning: string;
}

export interface VocabCardPreviewProps {
  items?: VocabItem[];
}

const defaultItems: VocabItem[] = [
  { character: '犬', romaji: 'inu', meaning: 'cachorro' },
  { character: '猫', romaji: 'neko', meaning: 'gato' },
  { character: '本', romaji: 'hon', meaning: 'livro' },
];

export function VocabCardPreview({ items = defaultItems }: VocabCardPreviewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {items.map((item, index) => (
        <Card key={index} className="flex-shrink-0 w-28 border-2">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-3xl font-bold text-primary font-japanese">
              {item.character}
            </div>
            <p className="text-xs text-text-secondary">{item.romaji}</p>
            <p className="text-xs font-medium text-foreground">{item.meaning}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
