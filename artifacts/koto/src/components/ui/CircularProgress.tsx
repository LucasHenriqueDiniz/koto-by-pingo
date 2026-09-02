interface CircularProgressProps {
  /** Current value (0–max). */
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  /** Color of the filled arc (CSS color). Defaults to the green tertiary. */
  color?: string;
  /** Color of the background track. */
  trackColor?: string;
  /** Center label (e.g. "90%"). When omitted, the percentage is shown. */
  label?: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 96,
  strokeWidth = 8,
  color = 'hsl(var(--tertiary))',
  trackColor = 'hsl(var(--muted))',
  label,
  className = '',
}: CircularProgressProps) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="transparent" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <span className="absolute font-heading text-xl font-bold text-foreground">
        {label ?? `${Math.round(pct * 100)}%`}
      </span>
    </div>
  );
}
