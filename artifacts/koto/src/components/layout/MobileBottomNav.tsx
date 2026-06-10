import { Link, useLocation } from 'wouter';
import { Home, BookOpen, Languages, FileText, TrendingUp } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Início', icon: Home, exact: true },
  { href: '/kana', label: 'Kana', icon: Languages },
  { href: '/vocabulario', label: 'Vocab', icon: BookOpen },
  { href: '/simulados', label: 'Provas', icon: FileText },
  { href: '/progresso', label: 'Progresso', icon: TrendingUp },
];

export function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border"
      aria-label="Navegação mobile"
    >
      <div className="flex items-stretch h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.exact ? location === '/' : location.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              data-testid={`bottom-nav-${tab.label.toLowerCase()}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
