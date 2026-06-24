import type { DailyActivity } from '@/services/progress/progress.local';

interface WeeklyActivityChartProps {
  data: DailyActivity[];
}

/** Gráfico de barras de atividade semanal (dado real). Replicado do mockup sem recharts. */
export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const max = Math.max(1, ...data.map(d => d.count));

  return (
    <div className="h-56 flex items-end justify-between gap-3">
      {data.map(day => {
        const heightPct = Math.round((day.count / max) * 100);
        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <span className="text-xs font-medium text-[--color-text-secondary]">{day.count}</span>
            <div className="w-full bg-muted rounded-t-lg relative flex-1 flex items-end overflow-hidden">
              <div
                className={`w-full rounded-t-lg transition-all duration-700 ${
                  day.isToday ? 'bg-primary' : day.count > 0 ? 'bg-foreground' : 'bg-border'
                }`}
                style={{ height: `${day.count === 0 ? 2 : heightPct}%` }}
              />
            </div>
            <span className={`text-xs ${day.isToday ? 'font-bold text-primary' : 'text-[--color-text-secondary]'}`}>
              {day.isToday ? 'Hoje' : day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
