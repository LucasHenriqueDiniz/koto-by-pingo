interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className = '' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Droplet / Pingo shape */}
      <path
        d="M16 2 C16 2 5 13 5 20 C5 26.627 9.925 31 16 31 C22.075 31 27 26.627 27 20 C27 13 16 2 16 2Z"
        fill="#E5484D"
      />
      {/* あ character inside */}
      <text
        x="16"
        y="25"
        textAnchor="middle"
        fontSize="13"
        fontFamily="'Noto Sans JP', sans-serif"
        fontWeight="700"
        fill="white"
        dominantBaseline="auto"
      >
        あ
      </text>
    </svg>
  );
}
