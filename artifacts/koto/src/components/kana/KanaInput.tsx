import { useRef, useEffect } from 'react';

interface KanaInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function KanaInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Digite o romaji...',
  className,
}: KanaInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && !disabled) {
          e.preventDefault();
          onSubmit();
        }
      }}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={
        className ??
        'w-full text-center text-lg px-4 py-3 border-2 border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50'
      }
      data-testid="kana-input"
    />
  );
}
