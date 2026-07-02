import { Link, useLocation } from 'wouter';

interface SubNavTab {
  href: string;
  label: string;
}

const TABS: SubNavTab[] = [
  { href: '/kanji', label: 'Visão geral' },
  { href: '/kanji/aprender', label: 'Aprender' },
  { href: '/kanji/treinar', label: 'Treinar' },
  { href: '/kanji/revisar', label: 'Revisar' },
  { href: '/kanji/estatisticas', label: 'Estatísticas' },
  { href: '/kanji/configurar', label: 'Configurar' },
];

export function KanjiSubNav() {
  const [location] = useLocation();

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-1 mb-5 -mx-1 px-1"
      aria-label="Navegação de Kanji"
      data-testid="kanji-sub-nav"
    >
      {TABS.map(tab => {
        const active = location === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            data-testid={`kanji-subnav-${tab.href === '/kanji' ? 'hub' : tab.href.split('/').pop()}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
