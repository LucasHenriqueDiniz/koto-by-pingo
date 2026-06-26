import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LANDING_ASSETS } from '@/constants/landingAssets';
import { StreakDisplay } from './StreakDisplay';
import { BadgeUnlock } from './BadgeUnlock';

export function GamificationSection() {
  return (
    <section className="py-12 md:py-20 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Progresso visível para você continuar voltando
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Components */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Streak */}
          <Card className="border-2">
            <CardContent className="p-6">
              <StreakDisplay currentDay={5} totalDays={7} />
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-2">
            <CardContent className="p-6 space-y-3">
              <div className="text-sm font-medium text-foreground">
                71% de hiragana dominado
              </div>
              <div className="w-full bg-secondary rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '71%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="border-2">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-foreground mb-4">
                Badges & Conquistas
              </p>
              <div className="flex justify-around">
                <BadgeUnlock emoji="🥇" label="Iniciante" unlocked={true} />
                <BadgeUnlock emoji="🥈" label="Hiragana Master" unlocked={false} />
                <BadgeUnlock emoji="🥉" label="Katakana Master" unlocked={false} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <motion.img
              src={LANDING_ASSETS.gamification}
              alt="Pingo celebrando com medalha e confete"
              className="w-full max-w-xs object-contain"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-lg text-text-secondary font-medium">
          Seu progresso te espera. Comece hoje mesmo.
        </p>
      </div>
    </section>
  );
}
