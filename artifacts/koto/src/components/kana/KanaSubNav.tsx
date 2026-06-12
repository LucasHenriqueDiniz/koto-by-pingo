import { Link, useLocation } from 'wouter';

interface SubNavTab {
  href: string;
  label: string;
}

const TABS: SubNavTab[] = [
  { href: '/kana', label: 'Visão geral' },
  { href: '/kana/aprender', label: 'Aprender' },
  { href: '/kana/treinar', label: 'Treinar' },
  { href: '/kana/revisar', label: 'Revisar' },
  { href: '/kana/estatisticas', label: 'Estatísticas' },
  { href: '/kana/configurar', label: 'Configurar' },
];

export function KanaSubNav() {
  const [location] = useLocation();

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-1 mb-5 -mx-1 px-1"
      aria-label="Navegação de Kana"
      data-testid="kana-sub-nav"
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
            data-testid={`kana-subnav-${tab.href === '/kana' ? 'hub' : tab.href.split('/').pop()}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
