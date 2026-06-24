import { Link, useLocation } from 'wouter';
import { MaterialIcon, type MaterialIconName } from '@/components/ui/MaterialIcon';

interface Tab {
  href: string;
  label: string;
  icon: MaterialIconName;
  exact?: boolean;
}

const tabs: Tab[] = [
  { href: '/', label: 'Início', icon: 'home', exact: true },
  { href: '/kana', label: 'Kana', icon: 'translate' },
  { href: '/vocabulario', label: 'Vocab', icon: 'menu_book' },
  { href: '/simulados', label: 'Provas', icon: 'assignment' },
  { href: '/progresso', label: 'Progresso', icon: 'trending_up' },
];

export function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border"
      aria-label="Navegação mobile"
    >
      <div className="flex items-stretch h-16">
        {tabs.map(tab => {
          const isActive = tab.exact ? location === '/' : location.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-[--color-text-secondary]'
              }`}
              data-testid={`bottom-nav-${tab.label.toLowerCase()}`}
            >
              <MaterialIcon name={tab.icon} filled={isActive} size={22} />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
