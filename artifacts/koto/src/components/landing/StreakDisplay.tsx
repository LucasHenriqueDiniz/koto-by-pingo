export interface StreakDisplayProps {
  currentDay?: number;
  totalDays?: number;
}

export function StreakDisplay({ currentDay = 5, totalDays = 7 }: StreakDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: totalDays }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 transition-colors ${
              i < currentDay
                ? 'bg-primary border-primary'
                : 'border-secondary bg-transparent'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-text-secondary">
        Você está no dia {currentDay} de {totalDays}! Falta pouco para ganhar uma nova cor.
      </p>
    </div>
  );
}
