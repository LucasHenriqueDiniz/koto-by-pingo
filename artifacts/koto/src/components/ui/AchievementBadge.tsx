import { MaterialIcon, type MaterialIconName } from '@/components/ui/MaterialIcon';

interface AchievementBadgeProps {
  icon: MaterialIconName;
  label: string;
  description?: string;
  locked?: boolean;
  /** Classe de gradiente do círculo (quando desbloqueado). */
  gradientClass?: string;
  /** Cor do ícone (quando desbloqueado). */
  iconClass?: string;
}

/**
 * Selo de conquista. ⚠️ Placeholder visual — o sistema de conquistas ainda não
 * tem lógica real (ver docs/TODO_GAMIFICATION.md).
 */
export function AchievementBadge({
  icon,
  label,
  description,
  locked = false,
  gradientClass = 'from-yellow-50 to-yellow-200 border-yellow-300',
  iconClass = 'text-yellow-700',
}: AchievementBadgeProps) {
  return (
    <div className={`flex flex-col items-center text-center ${locked ? 'opacity-40' : 'group'}`}>
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-transform ${
          locked
            ? 'bg-muted border-border'
            : `bg-gradient-to-br shadow-sm group-hover:scale-105 ${gradientClass}`
        }`}
      >
        <MaterialIcon
          name={locked ? 'lock' : icon}
          filled={!locked}
          size={36}
          className={locked ? 'text-[--color-text-secondary]' : iconClass}
        />
      </div>
      <span className="mt-3 text-sm font-medium text-foreground">{label}</span>
      {description && <span className="text-xs text-[--color-text-secondary]">{locked ? 'Bloqueado' : description}</span>}
    </div>
  );
}
