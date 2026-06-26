import { Card, CardContent } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    id: 'focus',
    title: 'Sem distrações',
    description:
      'Foco em hiragana, katakana e vocabulário N5. Sem propagandas ou distrações.',
    icon: 'target',
  },
  {
    id: 'offline',
    title: '100% Offline',
    description:
      'Aprenda sem internet. Seu progresso fica salvo localmente e sincroniza quando você faz login.',
    icon: 'cloud_off',
  },
  {
    id: 'gamification',
    title: 'Gamificação leve',
    description:
      'Streaks, badges visuais e progresso rastreado te mantêm voltando.',
    icon: 'emoji_events',
  },
  {
    id: 'brazilian',
    title: 'Feito para brasileiros',
    description:
      'Interface em português, exemplos culturais, comunidade BR.',
    icon: 'language',
  },
  {
    id: 'modes',
    title: 'Múltiplos modos de estudo',
    description:
      'Typing, flashcards, listening, quiz, matching. Escolha como aprender.',
    icon: 'library_books',
  },
  {
    id: 'progress',
    title: 'Progresso visível',
    description:
      'Gráficos reais, estatísticas por grupo/caractere, meta diária.',
    icon: 'trending_up',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-12 md:py-20 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Por que escolher Koto
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="border-2 hover:border-primary hover:bg-accent/30 transition-all hover:-translate-y-1 cursor-default"
          >
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start gap-4">
                <MaterialIcon
                  name={feature.icon}
                  className="text-3xl text-primary flex-shrink-0 mt-1"
                />
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
