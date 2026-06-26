import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LANDING_ASSETS } from '@/constants/landingAssets';

export function CTAFinalSection() {
  return (
    <section className="py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left: Copy */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-text-secondary">
            Treinos pequenos. Progresso real. Japonês sem complicação.
          </p>
        </div>

        <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          Estudar agora
        </Button>

        <p className="text-sm text-text-secondary">
          Leva menos de 1 minuto para começar. Sem cartão de crédito.
        </p>
      </motion.div>

      {/* Right: Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <motion.img
          src={LANDING_ASSETS.ctaFinal}
          alt="Pingo apontando para o primeiro passo"
          className="w-full max-w-xs object-contain"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
