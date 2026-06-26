import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LANDING_ASSETS } from '@/constants/landingAssets';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function AppDownloadSection() {
  return (
    <section className="py-16 md:py-24 space-y-12 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Estude onde quiser
            </h2>
            <p className="text-lg text-text-secondary">
              No navegador hoje, app em breve
            </p>
          </div>

          <p className="text-text-secondary">
            Koto começa como web app leve e offline. Em breve, você também poderá instalar no celular para praticar japonês todos os dias.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Usar versão web
            </Button>
            <Button size="lg" variant="outline">
              Quero ser avisado
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Badge className="bg-tertiary text-white">
              <MaterialIcon name="check_circle" className="w-3 h-3 mr-1" />
              Web App
            </Badge>
            <Badge className="bg-tertiary text-white">
              <MaterialIcon name="check_circle" className="w-3 h-3 mr-1" />
              Offline
            </Badge>
            <Badge variant="outline">
              <MaterialIcon name="schedule" className="w-3 h-3 mr-1" />
              Android em breve
            </Badge>
            <Badge variant="outline">
              <MaterialIcon name="schedule" className="w-3 h-3 mr-1" />
              iOS em breve
            </Badge>
          </div>
        </motion.div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-6"
        >
          {/* Mock Phone */}
          <div className="relative w-full max-w-xs">
            <div className="bg-white rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden aspect-[9/19.5]">
              <div className="bg-gray-50 h-full flex flex-col items-center justify-center p-4 space-y-4 text-center">
                <div className="text-3xl font-bold text-primary">🎯</div>
                <div className="text-sm font-medium text-foreground">Qual é o som?</div>
                <div className="text-2xl font-bold text-primary font-japanese">「あ」</div>
                <div className="text-xs text-text-secondary">Lição 1/10</div>
                <div className="w-full bg-secondary rounded-full h-1">
                  <div className="bg-primary w-1/10 h-full rounded-full" />
                </div>
              </div>
            </div>
            <img
              src={LANDING_ASSETS.hero}
              alt="Pingo com laptop"
              className="absolute -bottom-8 -right-4 w-24 h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
