import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { MaterialIcon, type MaterialIconName } from '@/components/ui/MaterialIcon';
import { updatePageSEO } from '../utils/seo';
import { getKanaStats, getKanaAccuracy, getWeeklyActivity } from '../services/progress/progress.local';
import { getWordOfDay } from '../utils/dailyWord';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { KanaTrainingMode } from '../types/kana';

interface QuickMode {
  mode: KanaTrainingMode;
  label: string;
  icon: MaterialIconName;
}

const QUICK_MODES: QuickMode[] = [
  { mode: 'flashcards', label: 'Flashcards', icon: 'style' },
  { mode: 'multiple_choice', label: 'Quiz', icon: 'quiz' },
  { mode: 'listening', label: 'Escuta', icon: 'hearing' },
  { mode: 'tracing', label: 'Desenhar', icon: 'stylus' },
];

export function HomePage() {
  const [, navigate] = useLocation();
  const [, setKanaMode] = useLocalStorage<KanaTrainingMode>('kana_train_mode', 'typing');

  useEffect(() => {
    updatePageSEO(
      'Koto by Pingo — Seu painel de estudos de japonês',
      'Continue de onde parou: treine kana, vocabulário e simulados com progresso real, no seu ritmo.',
    );
  }, []);

  const stats = getKanaStats();
  const accuracy = getKanaAccuracy();
  const masteryPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const weekly = getWeeklyActivity();
  const todayCount = weekly[weekly.length - 1]?.count ?? 0;
  const wordOfDay = getWordOfDay();

  const startQuick = (mode: KanaTrainingMode) => {
    setKanaMode(mode);
    navigate('/kana/treinar');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
      {/* Saudação */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground mb-2">Olá! Bom trabalho 🌸</h1>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Placeholder de nível/ofensiva — ver docs/TODO_GAMIFICATION.md */}
            <span className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">Nível não definido</span>
            <span className="flex items-center gap-1.5 text-[--color-text-secondary] text-sm">
              <MaterialIcon name="local_fire_department" filled size={18} className="text-primary" />
              0 dias de ofensiva
            </span>
          </div>
        </div>
        <Link
          href="/aulas"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
        >
          Ver percurso <MaterialIcon name="arrow_forward" size={18} />
        </Link>
      </motion.div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-5">
          {/* Continue de onde parou (progresso real de kana) */}
          <div className="relative overflow-hidden bg-primary rounded-2xl p-7 text-primary-foreground flex items-center gap-6">
            <div className="absolute -right-5 -bottom-8 font-japanese font-bold text-[160px] leading-none opacity-10 pointer-events-none select-none">さ</div>
            <div className="flex-1 relative z-10 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">Continue de onde parou</div>
              <div className="font-heading text-xl font-extrabold mb-1">Treino de Kana</div>
              <div className="font-japanese text-lg tracking-widest opacity-85 mb-4">あ か さ た な</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${masteryPct}%` }} />
                </div>
                <span className="text-xs opacity-80">{masteryPct}%</span>
              </div>
            </div>
            <Link
              href="/kana/treinar"
              className="relative z-10 flex items-center gap-1.5 bg-white/20 border border-white/30 px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap hover:bg-white/30 transition-colors flex-shrink-0"
            >
              Continuar <MaterialIcon name="arrow_forward" size={18} />
            </Link>
          </div>

          {/* Acesso rápido */}
          <div>
            <div className="text-xs font-bold text-[--color-text-secondary] uppercase tracking-wider mb-3.5">Acesso rápido</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_MODES.map(q => (
                <button
                  key={q.mode}
                  onClick={() => startQuick(q.mode)}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-2.5 hover:border-primary hover:bg-accent hover:-translate-y-0.5 transition-all"
                  data-testid={`quick-${q.mode}`}
                >
                  <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-primary">
                    <MaterialIcon name={q.icon} filled size={24} />
                  </div>
                  <span className="text-sm font-bold text-foreground">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats mini */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[11px] text-[--color-text-secondary] font-semibold uppercase tracking-wider mb-1.5">Kana dominados</div>
              <div className="font-heading text-xl font-extrabold text-foreground">
                {stats.mastered}<span className="text-sm text-muted-foreground/50">/{stats.total}</span>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[11px] text-[--color-text-secondary] font-semibold uppercase tracking-wider mb-1.5">Precisão</div>
              <div className="font-heading text-xl font-extrabold text-[hsl(var(--tertiary))]">{accuracy}%</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[11px] text-[--color-text-secondary] font-semibold uppercase tracking-wider mb-1.5">Hoje</div>
              <div className="font-heading text-xl font-extrabold text-foreground">{todayCount}</div>
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-4">
          {/* Palavra do dia */}
          <div className="bg-foreground rounded-2xl overflow-hidden relative">
            <div className="p-5 pb-0 relative">
              <div className="text-[10px] font-bold tracking-widest uppercase text-background/50 mb-3">Palavra do dia</div>
              <div className="font-japanese text-[110px] font-extrabold text-background leading-none mb-2">{wordOfDay.japanese}</div>
              <div className="absolute right-3 top-7 font-japanese text-[180px] font-extrabold text-background opacity-[0.04] leading-none pointer-events-none">{wordOfDay.japanese}</div>
            </div>
            <div className="bg-primary px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-heading text-sm font-extrabold text-primary-foreground uppercase tracking-wide">{wordOfDay.meaningPt} · {wordOfDay.kana}</div>
                <div className="text-[11px] text-primary-foreground/70 mt-0.5">{wordOfDay.romaji}</div>
              </div>
            </div>
          </div>

          {/* XP / ofensiva — placeholder (ver docs/TODO_GAMIFICATION.md) */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3.5">
              <MaterialIcon name="local_fire_department" filled size={24} className="text-primary" />
              <div>
                <div className="text-sm font-bold text-foreground">Ofensiva diária</div>
                <div className="text-xs text-[--color-text-secondary]">Em breve: ganhe XP treinando.</div>
              </div>
              <span className="ml-auto text-primary font-bold text-sm">0 XP</span>
            </div>
            <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-[--color-text-secondary]">
              <span>0 / 1000 XP</span><span>Próximo nível</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
