import { cn } from '@/lib/utils';

export type MaterialIconName =
  | 'home'
  | 'translate'
  | 'menu_book'
  | 'hearing'
  | 'assignment'
  | 'trending_up'
  | 'settings'
  | 'login'
  | 'logout'
  | 'notifications'
  | 'account_circle'
  | 'search'
  | 'volume_up'
  | 'bookmark_add'
  | 'bookmark'
  | 'check_circle'
  | 'arrow_forward'
  | 'arrow_back'
  | 'chevron_right'
  | 'chevron_left'
  | 'expand_more'
  | 'expand_less'
  | 'bolt'
  | 'emoji_events'
  | 'workspace_premium'
  | 'stars'
  | 'star'
  | 'filter_list'
  | 'stylus'
  | 'mail'
  | 'lock'
  | 'play_circle'
  | 'play_arrow'
  | 'pause'
  | 'pause_circle'
  | 'skip_previous'
  | 'close'
  | 'check'
  | 'timer'
  | 'schedule'
  | 'open_in_new'
  | 'auto_awesome'
  | 'edit'
  | 'school'
  | 'error'
  | 'warning'
  | 'restart_alt'
  | 'visibility'
  | 'description'
  | 'public'
  | 'track_changes'
  | 'cloud_upload'
  | 'progress_activity'
  | 'dock_to_right'
  | 'drag_indicator'
  | 'circle'
  | 'radio_button_unchecked'
  | 'more_horiz'
  | 'remove'
  | 'ink_eraser'
  | 'grid_view'
  | 'list'
  | 'manage_accounts'
  | 'key'
  | 'download'
  | 'delete_forever'
  | 'light_mode'
  | 'dark_mode'
  | 'contrast'
  | 'language'
  | 'palette'
  | (string & {});

interface MaterialIconProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  name: MaterialIconName;
  filled?: boolean;
  size?: number;
  weight?: 400 | 500 | 700;
}

export function MaterialIcon({ name, filled = false, size = 24, weight = 400, className, style, ...props }: MaterialIconProps) {
  return (
    <span
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
      className={cn('material-symbols-outlined select-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        lineHeight: 1,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
