import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LANDING_ASSETS } from '@/constants/landingAssets';
import { KanaGridPreview } from './KanaGridPreview';
import { VocabCardPreview } from './VocabCardPreview';
import { StudyModesGrid } from './StudyModesGrid';

export function LearningPathPreview() {
  return (
    <section
      id="learning-path"
      className="py-12 md:py-20 space-y-8 scroll-mt-20"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Comece pelo essencial
        </h2>
        <p className="text-text-secondary">Aprenda os fundamentos do japonês</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Pingo Decorative - Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden lg:flex justify-center"
        >
          <img
            src={LANDING_ASSETS.learningPreview}
            alt="Pingo estudando com cartão de hiragana"
            className="w-32 h-auto"
          />
        </motion.div>

        {/* Cards - Right */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hiragana & Katakana */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Hiragana & Katakana</CardTitle>
                <CardDescription>
                  Os dois scripts fundamentais do japonês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <KanaGridPreview count={8} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Vocabulary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Vocabulário N5</CardTitle>
                <CardDescription>
                  Palavras essenciais para iniciantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <VocabCardPreview />
              </CardContent>
            </Card>
          </motion.div>

          {/* Study Modes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Modos de Estudo</CardTitle>
                <CardDescription>
                  Escolha o jeito que funciona para você
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StudyModesGrid />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
