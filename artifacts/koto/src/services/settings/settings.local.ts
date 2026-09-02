import { storageGet, storageSet } from '../../utils/storage';

/**
 * General app preferences (not to be confused with learning progress).
 * Its own domain, separate from progress.local.ts — not a parallel auth/sync service.
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEffects: boolean;
  dailyReminders: boolean;
  showRomajiEverywhere: boolean;
  dailyGoalMinutes: number;
  autoCollapseSidebarInTraining: boolean;
}

const KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  soundEffects: true,
  dailyReminders: false,
  showRomajiEverywhere: false,
  dailyGoalMinutes: 15,
  autoCollapseSidebarInTraining: true,
};

export function getSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...(storageGet<Partial<AppSettings>>(KEY) ?? {}) };
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...patch };
  storageSet(KEY, next);
  if (patch.theme !== undefined) applyTheme(next.theme);
  return next;
}

/** Applies the theme to the document (`.dark` class). Called on app boot and when the preference changes. */
export function applyTheme(theme: AppSettings['theme'] = getSettings().theme): void {
  if (typeof document === 'undefined') return;
  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}
