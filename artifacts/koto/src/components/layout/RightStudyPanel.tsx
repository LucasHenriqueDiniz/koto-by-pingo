import type { VocabularyTrainingMode } from '../../types/vocabulary';

interface RightStudyPanelProps {
  mode?: VocabularyTrainingMode | string;
  category?: string;
  correct?: number;
  total?: number;
  weakCount?: number;
  hint?: string;
}

const modeLabels: Record<string, string> = {
  flashcards: 'Flashcards',
  word_selection: 'Seleção de palavras',
  matching_pairs: 'Combinar pares',
  translation_quiz: 'Quiz de tradução',
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  mixed: 'Misto',
};

const categoryLabels: Record<string, string> = {
  todos: 'Todos',
  saudações: 'Saudações',
  números: 'Números',
  família: 'Família',
  comida: 'Comida',
  cores: 'Cores',
  tempo: 'Tempo',
  lugares: 'Lugares',
  verbos: 'Verbos',
  adjetivos: 'Adjetivos',
};

export function RightStudyPanel({ mode, category, correct = 0, total = 0, weakCount, hint }: RightStudyPanelProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : null;

  return (
    <aside
      className="hidden xl:flex flex-col gap-4 w-64 flex-shrink-0"
      data-testid="right-study-panel"
    >
      {/* Session info */}
      <div className="bg-card border border-card-border rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sessão atual</h3>

        {mode && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Modo</span>
            <span className="font-medium text-foreground">{modeLabels[mode] ?? mode}</span>
          </div>
        )}

        {category && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Categoria</span>
            <span className="font-medium text-foreground">{categoryLabels[category] ?? category}</span>
          </div>
        )}

        {total > 0 && (
          <>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tentativas</span>
                <span className="font-medium text-foreground">{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Acertos</span>
                <span className="font-medium" style={{ color: '#2F9E44' }}>{correct}</span>
              </div>
              {accuracy !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precisão</span>
                  <span className="font-medium text-foreground">{accuracy}%</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Weak words */}
      {weakCount !== undefined && weakCount > 0 && (
        <div className="bg-card border border-card-border rounded-xl p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reforçar</h3>
          <p className="text-sm text-foreground">
            <span className="font-semibold text-primary">{weakCount}</span> palavra{weakCount !== 1 ? 's' : ''} com baixa precisão
          </p>
          <p className="text-xs text-muted-foreground mt-1">Use o filtro "Problemáticas" para treinar.</p>
        </div>
      )}

      {/* Hint */}
      {hint && (
        <div className="bg-accent/40 border border-accent rounded-xl p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Dica</h3>
          <p className="text-sm text-foreground">{hint}</p>
        </div>
      )}
    </aside>
  );
}
