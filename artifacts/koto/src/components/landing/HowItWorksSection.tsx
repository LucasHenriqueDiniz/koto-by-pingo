import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

const steps = [
  {
    number: '1',
    title: 'Escolha um caminho',
    description: 'Comece por hiragana, katakana ou vocabulário N5',
    icon: 'checklist',
  },
  {
    number: '2',
    title: 'Faça treinos curtos',
    description: '5-15 minutos por dia. Quiz, flashcards, typing, revisão',
    icon: 'flash_on',
  },
  {
    number: '3',
    title: 'Volte amanhã',
    description: 'Streak, badges e progresso visível te mantêm motivado',
    icon: 'trending_up',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 space-y-12 bg-gradient-to-b from-transparent via-accent/20 to-transparent">
      <div className="text-center space-y-3">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Como funciona
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto">
          Três passos simples para começar sua jornada no japonês
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connection line (desktop only) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 -right-8 w-16 h-1 bg-gradient-to-r from-primary/60 to-transparent" />
            )}

            <Card className="border-2 hover:border-primary transition-colors h-full relative">
              {/* Step number badge */}
              <div className="absolute -top-4 left-6 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>

              <CardContent className="p-6 pt-8 space-y-4">
                <MaterialIcon
                  name={step.icon}
                  className="text-3xl text-primary"
                />
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
