import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function ProductMockSection() {
  return (
    <section className="py-16 md:py-24 space-y-12 bg-gradient-to-b from-accent/30 to-transparent">
      <div className="text-center space-y-3">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Assim funciona uma lição
        </h2>
        <p className="text-text-secondary">
          Interface limpa pensada para você aprender de verdade
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Large Quiz Mock */}
        <Card className="border-2 border-primary shadow-2xl overflow-hidden">
          {/* Header with progress */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Lição 1 / 10</span>
              <span className="text-xs text-text-secondary">6 XP</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary w-1/10 h-full rounded-full" />
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 md:p-8 space-y-8 text-center">
            <div>
              <p className="text-sm text-text-secondary mb-4">Qual é o som?</p>
              <div className="text-6xl font-bold text-primary font-japanese mb-2">
                「か」
              </div>
              <p className="text-xs text-text-secondary">Pressione a resposta correta</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { opt: 'ka', correct: true },
                { opt: 'sa', correct: false },
                { opt: 'na', correct: false },
                { opt: 'ma', correct: false },
              ].map((item) => (
                <button
                  key={item.opt}
                  className={`py-6 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                    item.correct
                      ? 'bg-tertiary text-white border-2 border-tertiary shadow-lg'
                      : 'bg-secondary text-foreground border-2 border-secondary hover:border-primary/50'
                  }`}
                  disabled
                >
                  {item.opt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-text-secondary pt-4 border-t border-secondary">
              <div className="flex items-center gap-2">
                <MaterialIcon name="flash_on" className="text-orange-500" />
                <span>Streak: 5</span>
              </div>
              <div className="flex items-center gap-2">
                <MaterialIcon name="star" className="text-yellow-500" />
                <span>+10 XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mode examples below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
        {[
          { icon: 'quiz', title: 'Quiz Rápido', desc: '4 opções de resposta' },
          { icon: 'edit', title: 'Typing', desc: 'Digite o romaji' },
          { icon: 'headphones', title: 'Listening', desc: 'Ouça e responda' },
        ].map((mode) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 hover:border-primary transition-colors h-full">
              <CardContent className="p-4 text-center space-y-2">
                <MaterialIcon name={mode.icon} className="text-2xl text-primary mx-auto" />
                <h3 className="font-bold text-foreground text-sm">{mode.title}</h3>
                <p className="text-xs text-text-secondary">{mode.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
