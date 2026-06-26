import { Card, CardContent } from '@/components/ui/card';
import { hiragana } from '@/data/kana';

export interface KanaGridPreviewProps {
  count?: number;
  className?: string;
}

export function KanaGridPreview({ count = 8, className = '' }: KanaGridPreviewProps) {
  const basicKana = hiragana.filter((k) => k.group === 'basic').slice(0, count);

  return (
    <Card className={`border-2 ${className}`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {basicKana.map((item) => (
            <div key={item.id} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1 font-japanese">
                {item.character}
              </div>
              <p className="text-xs text-text-secondary">{item.romaji}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
