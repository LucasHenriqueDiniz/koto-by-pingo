interface AdPlaceholderProps {
  slot?: string;
  className?: string;
}

export function AdPlaceholder({ slot = 'banner', className = '' }: AdPlaceholderProps) {
  return (
    <div
      className={`w-full border border-dashed border-border rounded-lg bg-muted/30 flex items-center justify-center ${className}`}
      style={{ minHeight: slot === 'banner' ? 90 : 250 }}
      aria-hidden="true"
      data-testid={`ad-placeholder-${slot}`}
    >
      <span className="text-xs text-muted-foreground/50 select-none">Publicidade</span>
    </div>
  );
}
