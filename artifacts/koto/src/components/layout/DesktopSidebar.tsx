import { Link, useLocation } from 'wouter';
import {
  Home,
  Languages,
  BookOpen,
  Headphones,
  FileText,
  TrendingUp,
  Settings,
  LogIn,
} from 'lucide-react';
import { Show, SignInButton, UserButton } from '@clerk/react';
import { Logo } from '../brand/Logo';

const navLinks = [
  { href: '/', label: 'Início', icon: Home, exact: true },
  { href: '/kana', label: 'Kana', icon: Languages },
  { href: '/vocabulario', label: 'Vocabulário', icon: BookOpen },
  { href: '/escuta', label: 'Escuta', icon: Headphones },
  { href: '/simulados', label: 'Simulados', icon: FileText },
  { href: '/progresso', label: 'Progresso', icon: TrendingUp },
];

const bottomLinks = [
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function DesktopSidebar() {
  const [location] = useLocation();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === '/' || location === '' : location.startsWith(href);

  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 bg-background border-r border-border z-30"
      aria-label="Navegação lateral"
      data-testid="desktop-sidebar"
    >
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-border flex-shrink-0">
        <Link href="/">
          <Logo variant="horizontal" size="sm" />
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navLinks.map(link => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-accent text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              data-testid={`sidebar-link-${link.label.toLowerCase()}`}
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-3 border-t border-border space-y-1 flex-shrink-0">
        {bottomLinks.map(link => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-accent text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              data-testid={`sidebar-link-${link.label.toLowerCase()}`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {link.label}
            </Link>
          );
        })}

        {/* Autenticação */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid="sidebar-sign-in"
            >
              <LogIn size={17} strokeWidth={1.8} />
              Entrar
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <div className="flex items-center gap-3 px-3 py-2" data-testid="sidebar-user-button">
            <UserButton />
            <span className="text-sm font-medium text-foreground">Minha conta</span>
          </div>
        </Show>
      </div>
    </aside>
  );
}
