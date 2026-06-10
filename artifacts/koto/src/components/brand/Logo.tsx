import { BrandMark } from './BrandMark';

type LogoVariant = 'horizontal' | 'compact' | 'iconOnly';

interface LogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { mark: 24, koto: 'text-lg', byPingo: 'text-xs' },
  md: { mark: 32, koto: 'text-xl', byPingo: 'text-xs' },
  lg: { mark: 40, koto: 'text-2xl', byPingo: 'text-sm' },
};

export function Logo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const s = sizeMap[size];

  if (variant === 'iconOnly') {
    return <BrandMark size={s.mark} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="logo">
      <BrandMark size={s.mark} />
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-foreground ${s.koto}`}>
          Koto
        </span>
        {variant === 'horizontal' && (
          <span className={`text-muted-foreground font-medium ${s.byPingo}`} style={{ letterSpacing: '0.02em' }}>
            by Pingo
          </span>
        )}
      </div>
    </div>
  );
}
