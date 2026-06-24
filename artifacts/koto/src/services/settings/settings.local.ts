import { storageGet, storageSet } from '../../utils/storage';

/**
 * Preferências gerais do app (não confundir com progresso de aprendizado).
 * Domínio próprio, separado de progress.local.ts — não é um serviço de auth/sync paralelo.
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEffects: boolean;
  dailyReminders: boolean;
  showRomajiEverywhere: boolean;
  dailyGoalMinutes: number;
}

const KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  soundEffects: true,
  dailyReminders: false,
  showRomajiEverywhere: false,
  dailyGoalMinutes: 15,
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

/** Aplica o tema no documento (classe .dark). Chamado no boot do app e ao alterar a preferência. */
export function applyTheme(theme: AppSettings['theme'] = getSettings().theme): void {
  if (typeof document === 'undefined') return;
  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}
