import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LANDING_ASSETS } from '@/constants/landingAssets';

export function LandingHero() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 z-10"
        >
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-primary/20 text-primary border border-primary/40">
              ✓ 100% Offline
            </Badge>
            <Badge className="bg-tertiary/20 text-tertiary border border-tertiary/40">
              ✓ Grátis
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-700 border border-blue-500/40">
              Web App
            </Badge>
          </div>

          <div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              Aprenda japonês em treinos curtos todos os dias
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Comece por hiragana, katakana e vocabulário N5 com lições rápidas, progresso visual e o Pingo te acompanhando.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium text-base h-12">
              Começar agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-medium text-base h-12"
              onClick={() => {
                document.getElementById('how-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver como funciona
            </Button>
          </div>
        </motion.div>

        {/* Right: Visual with floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-96 md:h-96 lg:h-full min-h-96"
        >
          {/* Main Pingo Image */}
          <motion.img
            src={LANDING_ASSETS.hero}
            alt="Pingo com laptop estudando"
            className="w-full max-w-xs object-contain mx-auto"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Card 1: Streak (top-right) */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-0 right-0 md:right-4 -translate-y-4"
          >
            <Card className="w-32 border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/20 shadow-xl">
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-2xl font-bold text-primary">🔥 7</div>
                <div className="text-xs font-medium text-text-secondary">dia streak</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Progress (middle-right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute top-1/3 right-0 md:right-8 -translate-y-1/2"
          >
            <Card className="w-36 border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/20 shadow-xl">
              <CardContent className="p-4 space-y-3">
                <div className="text-sm font-bold text-primary">Hiragana</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div className="bg-primary w-[32%] h-full rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-foreground">32%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Quiz (bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs px-4"
          >
            <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/20 shadow-xl">
              <CardContent className="p-4 text-center space-y-3">
                <div className="text-xs font-medium text-text-secondary">Qual é o som?</div>
                <div className="text-3xl font-bold text-primary font-japanese">「あ」</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {['a', 'i', 'u', 'e'].map((opt, i) => (
                    <button
                      key={opt}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        i === 0
                          ? 'bg-tertiary text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/70'
                      }`}
                      disabled
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
