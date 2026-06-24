import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { SignIn } from '@clerk/react';
import { useCurrentUser } from '../services/auth/auth.clerk';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { updatePageSEO } from '../utils/seo';

const features: { icon: MaterialIconName; text: string }[] = [
  { icon: 'bolt', text: 'Treinos adaptativos por nível' },
  { icon: 'emoji_events', text: 'Progresso com ofensivas e conquistas' },
  { icon: 'hearing', text: 'Treino de escuta e pronúncia' },
];

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useCurrentUser();

  useEffect(() => {
    updatePageSEO('Entrar — Koto by Pingo', 'Entre na sua conta Koto para sincronizar seu progresso de japonês.');
  }, []);

  useEffect(() => {
    if (isAuthenticated) setLocation('/');
  }, [isAuthenticated, setLocation]);

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — hero vermelho */}
      <div className="hidden md:flex md:w-[42%] relative overflow-hidden flex-col items-center justify-center bg-primary px-12 py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none font-japanese font-extrabold text-white opacity-[0.06] leading-none text-[460px]">
          語
        </div>
        <div className="relative flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-3 bg-white/10 border border-white/25 rounded-2xl px-6 py-3.5">
            <MaterialIcon name="translate" filled size={28} className="text-white" />
            <span className="font-heading font-extrabold text-2xl text-white">Koto</span>
          </div>
          <div className="w-12 h-0.5 bg-white/35 rounded-full" />
          <div>
            <p className="font-heading text-2xl font-bold text-white leading-tight mb-2.5">
              Aprenda japonês<br />do jeito certo.
            </p>
            <p className="text-sm text-white/70 leading-relaxed max-w-[240px] mx-auto">
              Kana, vocabulário e escuta — tudo em um só lugar.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-2.5">
                <MaterialIcon name={f.icon} filled size={20} className="text-white flex-shrink-0" />
                <span className="text-sm text-white/90 font-medium text-left">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="absolute bottom-6 text-xs text-white/40">© {new Date().getFullYear()} Pingo Concursos</p>
      </div>

      {/* Painel direito — Clerk SignIn */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <div className="text-center md:hidden">
            <span className="font-heading font-extrabold text-2xl text-primary">Koto</span>
          </div>
          <SignIn
            routing="hash"
            appearance={{
              variables: {
                colorPrimary: '#ac2b2f',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderRadius: '0.625rem',
              },
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border border-border bg-card',
                headerTitle: 'font-heading',
              },
            }}
          />
          <p className="text-xs text-[--color-text-secondary] text-center max-w-xs">
            Entrar é opcional — o Koto funciona offline. Faça login apenas para sincronizar seu progresso entre dispositivos.
          </p>
        </div>
      </div>
    </div>
  );
}
