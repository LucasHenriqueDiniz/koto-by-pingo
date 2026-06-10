interface AppIconProps {
  size?: number;
  className?: string;
}

export function AppIcon({ size = 48, className = '' }: AppIconProps) {
  const r = size * 0.22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx={r} fill="#E5484D" />
      {/* Simplified pingo/droplet silhouette */}
      <path
        d="M24 6 C24 6 14 16 14 23 C14 28.523 18.477 33 24 33 C29.523 33 34 28.523 34 23 C34 16 24 6 24 6Z"
        fill="white"
        opacity="0.9"
      />
      {/* あ inside */}
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="14"
        fontFamily="'Noto Sans JP', sans-serif"
        fontWeight="700"
        fill="#E5484D"
        dominantBaseline="auto"
      >
        あ
      </text>
    </svg>
  );
}
