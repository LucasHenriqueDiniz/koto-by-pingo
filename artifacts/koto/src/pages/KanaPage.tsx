import { useEffect, useState } from 'react';
import type { KanaType } from '../types/kana';
import { KanaTrainer } from '../components/kana/KanaTrainer';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';

const tabs: { value: KanaType; label: string }[] = [
  { value: 'hiragana', label: 'Hiragana' },
  { value: 'katakana', label: 'Katakana' },
  { value: 'mixed', label: 'Misto' },
];

export function KanaPage() {
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [key, setKey] = useState(0);

  useEffect(() => {
    updatePageSEO('Treino de Kana', 'Treine hiragana e katakana com feedback imediato. Registre seu progresso e acompanhe sua evolução.');
  }, []);

  const handleTabChange = (type: KanaType) => {
    setKanaType(type);
    setKey(k => k + 1);
  };

  return (
    <div>
      <PageHeader
        title="Treino de Kana"
        description="Treine hiragana e katakana com feedback imediato."
        color="#E5484D"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Tab selector */}
          <div className="flex bg-muted rounded-xl p-1 gap-1" data-testid="kana-type-tabs">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  kanaType === tab.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`kana-tab-${tab.value}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Trainer */}
          <KanaTrainer key={key} type={kanaType} />

          {/* Hint */}
          <p className="text-xs text-muted-foreground text-center">
            Pressione <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono text-xs">Enter</kbd> para confirmar. O campo não diferencia maiúsculas.
          </p>
        </div>

        <div className="mt-10">
          <AdPlaceholder slot="banner" />
        </div>
      </div>
    </div>
  );
}
