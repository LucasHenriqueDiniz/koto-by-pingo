import { MaterialIcon } from '@/components/ui/MaterialIcon';

export interface BadgeUnlockProps {
  emoji: string;
  label: string;
  unlocked?: boolean;
}

export function BadgeUnlock({ emoji, label, unlocked = true }: BadgeUnlockProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-16 h-16 rounded-lg flex items-center justify-center text-3xl transition-opacity ${
        unlocked ? 'bg-accent' : 'bg-secondary opacity-50'
      }`}>
        {emoji}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MaterialIcon
              name="lock"
              className="text-text-secondary text-lg"
            />
          </div>
        )}
      </div>
      <p className="text-xs text-center font-medium text-text-secondary">{label}</p>
    </div>
  );
}
