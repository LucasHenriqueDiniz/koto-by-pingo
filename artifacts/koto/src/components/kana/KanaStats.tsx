interface KanaStatsProps {
  correct: number;
  total: number;
  accuracy: number;
}

export function KanaStats({ correct, total, accuracy }: KanaStatsProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-6 justify-center text-sm" data-testid="kana-stats">
      <div className="text-center">
        <span className="block text-lg font-bold text-foreground">{total}</span>
        <span className="text-xs text-muted-foreground">tentativas</span>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <span className="block text-lg font-bold" style={{ color: '#2F9E44' }}>{correct}</span>
        <span className="text-xs text-muted-foreground">acertos</span>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <span className="block text-lg font-bold text-foreground">{accuracy}%</span>
        <span className="text-xs text-muted-foreground">precisão</span>
      </div>
    </div>
  );
}
