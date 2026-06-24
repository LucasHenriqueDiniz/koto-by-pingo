import { Switch } from '@/components/ui/switch';
import { MaterialIcon, type MaterialIconName } from '@/components/ui/MaterialIcon';

interface SettingsToggleRowProps {
  icon?: MaterialIconName;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  'data-testid'?: string;
}

export function SettingsToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  'data-testid': testId,
}: SettingsToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <MaterialIcon name={icon} size={20} className="text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && <p className="text-xs text-[--color-text-secondary]">{description}</p>}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} data-testid={testId} />
    </div>
  );
}
