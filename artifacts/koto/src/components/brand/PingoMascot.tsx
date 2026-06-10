import { useState, useEffect } from 'react';

export type PingoVariant = 'default' | 'kana' | 'listening' | 'exam' | 'progress';

interface PingoMascotProps {
  variant?: PingoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizePx = { sm: 80, md: 120, lg: 160, xl: 200 };

function PingoSVG({ variant, size }: { variant: PingoVariant; size: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pingo-sensei"
    >
      {/* Body - black oval */}
      <ellipse cx={cx} cy={cy * 1.1} rx={cx * 0.72} ry={cy * 0.82} fill="#1A1A1A" />

      {/* Belly - cream/white */}
      <ellipse cx={cx} cy={cy * 1.2} rx={cx * 0.42} ry={cy * 0.52} fill="#FBF6EE" />

      {/* Head - black circle */}
      <circle cx={cx} cy={cy * 0.52} r={cx * 0.44} fill="#1A1A1A" />

      {/* Eyes - white sclera */}
      <circle cx={cx - cx * 0.18} cy={cy * 0.44} r={cx * 0.12} fill="white" />
      <circle cx={cx + cx * 0.18} cy={cy * 0.44} r={cx * 0.12} fill="white" />

      {/* Pupils */}
      <circle cx={cx - cx * 0.16} cy={cy * 0.45} r={cx * 0.07} fill="#1A1A1A" />
      <circle cx={cx + cx * 0.16} cy={cy * 0.45} r={cx * 0.07} fill="#1A1A1A" />

      {/* Eye shine */}
      <circle cx={cx - cx * 0.13} cy={cy * 0.42} r={cx * 0.025} fill="white" />
      <circle cx={cx + cx * 0.19} cy={cy * 0.42} r={cx * 0.025} fill="white" />

      {/* Beak */}
      <path
        d={`M${cx - cx * 0.08} ${cy * 0.58} L${cx} ${cy * 0.66} L${cx + cx * 0.08} ${cy * 0.58} Z`}
        fill="#E5484D"
      />

      {/* Flippers */}
      <ellipse cx={cx - cx * 0.72} cy={cy * 1.1} rx={cx * 0.18} ry={cy * 0.35} fill="#1A1A1A" transform={`rotate(-15 ${cx - cx * 0.72} ${cy * 1.1})`} />
      <ellipse cx={cx + cx * 0.72} cy={cy * 1.1} rx={cx * 0.18} ry={cy * 0.35} fill="#1A1A1A" transform={`rotate(15 ${cx + cx * 0.72} ${cy * 1.1})`} />

      {/* Feet */}
      <ellipse cx={cx - cx * 0.28} cy={cy * 1.88} rx={cx * 0.22} ry={cy * 0.1} fill="#E5484D" />
      <ellipse cx={cx + cx * 0.28} cy={cy * 1.88} rx={cx * 0.22} ry={cy * 0.1} fill="#E5484D" />

      {/* Variant-specific accessories */}
      {(variant === 'kana' || variant === 'exam') && (
        /* Hachimaki (red headband) */
        <>
          <path
            d={`M${cx - cx * 0.42} ${cy * 0.3} Q${cx} ${cy * 0.14} ${cx + cx * 0.42} ${cy * 0.3}`}
            stroke="#E5484D"
            strokeWidth={cx * 0.1}
            fill="none"
            strokeLinecap="round"
          />
          {/* Knot on the side */}
          <ellipse cx={cx + cx * 0.38} cy={cy * 0.28} rx={cx * 0.1} ry={cx * 0.07} fill="#E5484D" />
        </>
      )}

      {variant === 'kana' && (
        /* Flashcard with あ */
        <g transform={`translate(${cx + cx * 0.55} ${cy * 0.7})`}>
          <rect x="0" y="0" width={cx * 0.55} height={cx * 0.5} rx="3" fill="white" stroke="#E8E2D8" strokeWidth="1.5" />
          <text x={cx * 0.275} y={cx * 0.36} textAnchor="middle" fontSize={cx * 0.28} fontFamily="'Noto Sans JP', sans-serif" fontWeight="700" fill="#E5484D">
            あ
          </text>
        </g>
      )}

      {variant === 'listening' && (
        /* Headphones */
        <>
          <path
            d={`M${cx - cx * 0.46} ${cy * 0.44} Q${cx - cx * 0.46} ${cy * 0.08} ${cx} ${cy * 0.08} Q${cx + cx * 0.46} ${cy * 0.08} ${cx + cx * 0.46} ${cy * 0.44}`}
            stroke="#1A1A1A"
            strokeWidth={cx * 0.08}
            fill="none"
            strokeLinecap="round"
          />
          <rect x={cx - cx * 0.56} y={cy * 0.38} width={cx * 0.2} height={cx * 0.26} rx={cx * 0.08} fill="#0284C7" />
          <rect x={cx + cx * 0.36} y={cy * 0.38} width={cx * 0.2} height={cx * 0.26} rx={cx * 0.08} fill="#0284C7" />
        </>
      )}

      {variant === 'progress' && (
        /* Pencil */
        <g transform={`translate(${cx + cx * 0.5} ${cy * 0.55}) rotate(30)`}>
          <rect x="0" y="0" width={cx * 0.12} height={cx * 0.55} rx="2" fill="#F59F00" />
          <polygon points={`${cx * 0.06},${cx * 0.55} 0,${cx * 0.7} ${cx * 0.12},${cx * 0.7}`} fill="#FBF6EE" />
          <polygon points={`${cx * 0.06},${cx * 0.62} 0,${cx * 0.7} ${cx * 0.12},${cx * 0.7}`} fill="#1A1A1A" />
          <rect x="0" y="0" width={cx * 0.12} height={cx * 0.08} rx="2" fill="#FF9999" />
        </g>
      )}
    </svg>
  );
}

export function PingoMascot({ variant = 'default', size = 'md', className = '' }: PingoMascotProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const px = sizePx[size];

  useEffect(() => {
    const img = new Image();
    img.src = '/brand/pingo.png';
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgError(true);
  }, []);

  if (imgLoaded && !imgError) {
    return (
      <img
        src="/brand/pingo.png"
        alt="Pingo-sensei"
        width={px}
        height={px}
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <div className={className} style={{ width: px, height: px }}>
      <PingoSVG variant={variant} size={px} />
    </div>
  );
}
