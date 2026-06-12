interface KanaCharacterCardProps {
  character: string;
  romaji?: string;
  showRomaji?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-28 h-28 text-5xl',
  md: 'w-36 h-36 text-6xl',
  lg: 'w-44 h-44 text-7xl',
};

export function KanaCharacterCard({ character, romaji, showRomaji, size = 'lg', className = '' }: KanaCharacterCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-border bg-card shadow-sm ${SIZE_CLASSES[size]} ${className}`}
      data-testid="kana-character-card"
    >
      <span
        className="font-medium select-none"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        data-testid="kana-character"
      >
        {character}
      </span>
      {showRomaji && romaji && (
        <span className="text-sm text-muted-foreground mt-2 font-mono" data-testid="kana-romaji-hint">
          {romaji}
        </span>
      )}
    </div>
  );
}
