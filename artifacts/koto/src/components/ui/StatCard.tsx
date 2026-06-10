import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, color = '#E5484D', subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`bg-card border border-card-border rounded-xl p-4 flex items-start gap-3 ${className}`}>
      {Icon && (
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '18' }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
