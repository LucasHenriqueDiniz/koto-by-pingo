import { PingoMascot, type PingoVariant } from './PingoMascot';

interface MascotMessageProps {
  message: string;
  variant?: PingoVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MascotMessage({ message, variant = 'default', size = 'md', className = '' }: MascotMessageProps) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <PingoMascot variant={variant} size={size} />
      <div className="relative bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-xs">
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
        {/* Speech bubble tail */}
        <div
          className="absolute -bottom-2 left-3 w-3 h-3 bg-surface border-b border-l border-border"
          style={{ transform: 'rotate(-45deg)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
      </div>
    </div>
  );
}
