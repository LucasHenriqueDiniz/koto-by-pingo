import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, Eye, Star, AlertTriangle } from 'lucide-react';
import { getKanaStats } from '../services/progress/progress.local';
import { KanaSubNav } from '../components/kana/KanaSubNav';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';

const QUICK_LINKS = [
  {
    href: '/kana/aprender',
    title: 'Aprender',
    description: 'Veja a tabela de referência de hiragana e katakana, com exemplos de palavras.',
    color: '#0284C7',
  },
  {
    href: '/kana/treinar',
    title: 'Treinar',
    description: '7 modos de treino: digitação, flashcards, escolha rápida, pares, escuta, montar palavra e traçado.',
    color: '#E5484D',
  },
  {
    href: '/kana/revisar',
    title: 'Revisar',
    description: 'Foque nos caracteres difíceis, nunca vistos e veja os que você já domina.',
    color: '#F59F00',
  },
  {
    href: '/kana/estatisticas',
    title: 'Estatísticas',
    description: 'Acompanhe sua precisão geral e por grupo de kana.',
    color: '#7C3AED',
  },
  {
    href: '/kana/configurar',
    title: 'Configurar',
    description: 'Escolha grupos, dicas e o modo de treino padrão.',
    color: '#16A34A',
  },
];

export function KanaHubPage() {
  useEffect(() => {
    updatePageSEO('Kana', 'Aprenda, treine e acompanhe seu progresso em hiragana e katakana.');
  }, []);

  const stats = getKanaStats();

  return (
    <div>
      <PageHeader title="Kana" description="Hiragana e katakana: aprenda, treine e acompanhe seu progresso." color="#E5484D" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <KanaSubNav />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} icon={BookOpen} color="#16A34A" />
          <StatCard label="Vistos" value={stats.seen} icon={Eye} color="#0284C7" />
          <StatCard label="Dominados" value={stats.mastered} icon={Star} color="#F59F00" />
          <StatCard label="Difíceis" value={stats.weak} icon={AlertTriangle} color="#E5484D" />
        </div>

        <AdPlaceholder slot="banner" />

        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-card border border-card-border rounded-2xl p-5 transition-colors hover:bg-muted/50"
              data-testid={`kana-hub-link-${link.href.split('/').pop()}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: link.color }} />
                    <h2 className="text-sm font-semibold text-foreground">{link.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight size={18} className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
