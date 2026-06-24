import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Show, UserButton } from '@clerk/react';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { SettingsToggleRow } from '../components/ui/SettingsToggleRow';
import { useCurrentUser } from '../services/auth/auth.clerk';
import { getSettings, updateSettings, type AppSettings } from '../services/settings/settings.local';
import { updatePageSEO } from '../utils/seo';

const THEME_OPTIONS: { value: AppSettings['theme']; label: string; icon: MaterialIconName }[] = [
  { value: 'light', label: 'Claro', icon: 'light_mode' },
  { value: 'dark', label: 'Escuro', icon: 'dark_mode' },
  { value: 'system', label: 'Auto', icon: 'contrast' },
];

const GOAL_OPTIONS = [5, 10, 15, 20, 30];

const LANGUAGES: { flag: string; label: string; enabled: boolean }[] = [
  { flag: '🇧🇷', label: 'Português (BR)', enabled: true },
  { flag: '🇺🇸', label: 'English', enabled: false },
  { flag: '🇯🇵', label: '日本語', enabled: false },
];

function SectionHeader({ icon, title }: { icon: MaterialIconName; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-primary flex-shrink-0">
        <MaterialIcon name={icon} filled size={20} />
      </div>
      <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
    </div>
  );
}

export function SettingsPage() {
  const { user, isAuthenticated } = useCurrentUser();
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    updatePageSEO('Configurações', 'Ajuste tema, sons e preferências do Koto by Pingo.');
  }, []);

  const patch = (p: Partial<AppSettings>) => setSettings(updateSettings(p));
  const initial = (user?.displayName ?? 'V').charAt(0).toUpperCase();

  return (
    <div>
      <PageHeader title="Configurações" description="Personalize sua experiência no Koto." />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Perfil */}
        <section className="bg-card border border-card-border rounded-2xl p-6 md:p-7 flex flex-col sm:flex-row items-center gap-6">
          <Show when="signed-in">
            <div className="flex-shrink-0">
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#ce4445] flex items-center justify-center text-primary-foreground font-heading text-3xl font-extrabold flex-shrink-0">
              {initial}
            </div>
          </Show>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="font-heading text-xl font-bold text-foreground truncate">{user?.displayName ?? 'Visitante'}</h2>
            {isAuthenticated && user?.email ? (
              <p className="text-sm text-[--color-text-secondary] truncate mb-3">{user.email}</p>
            ) : (
              <p className="text-sm text-[--color-text-secondary] mb-3">Seu progresso fica salvo neste dispositivo.</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">Iniciante</span>
              <span className="bg-muted text-[--color-text-secondary] text-xs font-bold px-3 py-1 rounded-full">Treino local 🔥</span>
            </div>
          </div>

          {!isAuthenticated && (
            <Link
              href="/entrar"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <MaterialIcon name="login" size={18} />
              Entrar
            </Link>
          )}
        </section>

        {/* Seções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Estudo */}
          <section className="bg-card border border-card-border rounded-2xl p-6 flex flex-col gap-5">
            <SectionHeader icon="school" title="Estudo" />
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-semibold text-foreground">Meta diária</span>
                <span className="text-sm font-bold text-primary">{settings.dailyGoalMinutes} min</span>
              </div>
              <div className="flex bg-background border border-border rounded-lg p-0.5 gap-0.5">
                {GOAL_OPTIONS.map(min => (
                  <button
                    key={min}
                    onClick={() => patch({ dailyGoalMinutes: min })}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      settings.dailyGoalMinutes === min ? 'bg-primary text-primary-foreground' : 'text-[--color-text-secondary] hover:text-foreground'
                    }`}
                    data-testid={`goal-${min}`}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-border divide-y divide-border">
              <SettingsToggleRow
                icon="notifications"
                label="Lembrete diário"
                description="Em breve: notificação para estudar."
                checked={settings.dailyReminders}
                onCheckedChange={v => patch({ dailyReminders: v })}
                data-testid="setting-reminders"
              />
              <SettingsToggleRow
                icon="chevron_left"
                label="Recolher menu durante o treino"
                description="Esconde a barra lateral automaticamente ao iniciar um treino ou simulado."
                checked={settings.autoCollapseSidebarInTraining}
                onCheckedChange={v => patch({ autoCollapseSidebarInTraining: v })}
                data-testid="setting-auto-collapse-sidebar"
              />
            </div>
          </section>

          {/* Aparência */}
          <section className="bg-card border border-card-border rounded-2xl p-6 flex flex-col gap-5">
            <SectionHeader icon="palette" title="Aparência" />
            <div>
              <span className="block text-sm font-semibold text-foreground mb-2.5">Tema</span>
              <div className="flex bg-background border border-border rounded-lg p-0.5 gap-0.5">
                {THEME_OPTIONS.map(opt => {
                  const active = settings.theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => patch({ theme: opt.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-colors ${
                        active ? 'bg-card shadow-sm text-foreground' : 'text-[--color-text-secondary] hover:text-foreground'
                      }`}
                      data-testid={`theme-${opt.value}`}
                    >
                      <MaterialIcon name={opt.icon} filled={active} size={16} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-border divide-y divide-border">
              <SettingsToggleRow
                icon="translate"
                label="Mostrar romaji por padrão"
                description="Exibe a leitura romaji como dica."
                checked={settings.showRomajiEverywhere}
                onCheckedChange={v => patch({ showRomajiEverywhere: v })}
                data-testid="setting-romaji"
              />
              <SettingsToggleRow
                icon="volume_up"
                label="Sons de feedback"
                description="Toque ao acertar ou errar."
                checked={settings.soundEffects}
                onCheckedChange={v => patch({ soundEffects: v })}
                data-testid="setting-sound"
              />
            </div>
          </section>

          {/* Idioma — placeholder (só PT-BR ativo) */}
          <section className="bg-card border border-card-border rounded-2xl p-6 flex flex-col gap-4">
            <SectionHeader icon="language" title="Idioma da Interface" />
            <div className="flex flex-col gap-2">
              {LANGUAGES.map(lang => (
                <div
                  key={lang.label}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 ${
                    lang.enabled ? 'bg-accent border-primary' : 'bg-card border-border opacity-60'
                  }`}
                  title={lang.enabled ? undefined : 'Em breve'}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{lang.flag}</span>
                    <span className={`text-sm font-bold ${lang.enabled ? 'text-foreground' : 'text-[--color-text-secondary]'}`}>
                      {lang.label}
                    </span>
                  </div>
                  {lang.enabled && <MaterialIcon name="check_circle" filled size={18} className="text-primary" />}
                </div>
              ))}
            </div>
          </section>

          {/* Conta / Dados */}
          <section className="bg-card border border-card-border rounded-2xl p-6 flex flex-col gap-3">
            <SectionHeader icon="manage_accounts" title="Conta e dados" />
            <Link
              href="/progresso"
              className="flex items-center gap-3 px-4 py-3.5 bg-background border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-accent transition-colors"
            >
              <MaterialIcon name="trending_up" size={20} className="text-[--color-text-secondary]" />
              Ver progresso e resetar dados
            </Link>
            <Show when="signed-in">
              <div className="flex items-center gap-3 px-4 py-3.5 bg-background border border-border rounded-xl">
                <UserButton />
                <span className="text-sm font-semibold text-foreground">Gerenciar conta</span>
              </div>
            </Show>
            <Show when="signed-out">
              <Link
                href="/entrar"
                className="flex items-center gap-3 px-4 py-3.5 bg-background border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-accent transition-colors"
              >
                <MaterialIcon name="login" size={20} className="text-[--color-text-secondary]" />
                Entrar para sincronizar
              </Link>
            </Show>
          </section>
        </div>
      </div>
    </div>
  );
}
