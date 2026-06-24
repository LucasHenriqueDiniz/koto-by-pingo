import { Link, useLocation } from 'wouter';
import { Show, UserButton } from '@clerk/react';
import { MaterialIcon, type MaterialIconName } from '@/components/ui/MaterialIcon';
import { useActiveSession, CONFIRM_LEAVE_SESSION_MESSAGE } from '../../contexts/ActiveSessionContext';

interface NavLink {
  href: string;
  label: string;
  icon: MaterialIconName;
  /** Quando true, ativo apenas em correspondência exata (evita conflito com sub-rotas). */
  exact?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Início', icon: 'home', exact: true },
  { href: '/aulas', label: 'Aulas Extras', icon: 'auto_stories' },
  { href: '/kana', label: 'Kana', icon: 'translate' },
  { href: '/vocabulario', label: 'Vocabulário', icon: 'menu_book', exact: true },
  { href: '/vocabulario/treinar', label: 'Treino Vocab', icon: 'sports_esports' },
  { href: '/simulados', label: 'Simulados', icon: 'assignment' },
  { href: '/progresso', label: 'Progresso', icon: 'trending_up' },
];

const bottomLinks: NavLink[] = [
  { href: '/configuracoes', label: 'Configurações', icon: 'settings' },
];

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function DesktopSidebar({ collapsed, onToggleCollapse }: DesktopSidebarProps) {
  const [location] = useLocation();
  const { isSessionActive } = useActiveSession();

  const isActive = (href: string, exact?: boolean) => {
    if (href === '/') return location === '/' || location === '';
    if (exact) return location === href;
    return location.startsWith(href);
  };

  const guardNav = (e: React.MouseEvent) => {
    if (isSessionActive && !window.confirm(CONFIRM_LEAVE_SESSION_MESSAGE)) {
      e.preventDefault();
    }
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150 ${collapsed ? 'justify-center' : ''} ${
      active
        ? 'bg-accent text-primary font-bold'
        : 'text-[--color-text-secondary] font-medium hover:bg-muted hover:text-foreground'
    }`;

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-card border-r border-border z-30 py-6 px-3 gap-6 transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Navegação lateral"
      data-testid="desktop-sidebar"
      data-collapsed={collapsed}
    >
      {/* Logo */}
      <div className="px-2">
        <Link href="/" className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`} onClick={guardNav}>
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-sm flex-shrink-0">
            <MaterialIcon name="translate" filled size={22} className="text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-none">
              <h1 className="font-heading text-xl font-bold text-foreground leading-none">Koto</h1>
              <p className="text-xs text-[--color-text-secondary] opacity-70">by Pingo</p>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle de colapso */}
      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        data-testid="sidebar-collapse-toggle"
        className="flex items-center justify-center w-full py-2 rounded-lg text-[--color-text-secondary] hover:bg-muted hover:text-foreground transition-colors -mt-3"
      >
        <MaterialIcon name={collapsed ? 'chevron_right' : 'chevron_left'} size={20} />
      </button>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto space-y-1">
        {navLinks.map(link => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(active)}
              data-testid={`sidebar-link-${link.label.toLowerCase()}`}
              onClick={guardNav}
              title={collapsed ? link.label : undefined}
            >
              <MaterialIcon name={link.icon} size={22} />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-border pt-3 space-y-1">
        {bottomLinks.map(link => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(active)}
              data-testid={`sidebar-link-${link.label.toLowerCase()}`}
              onClick={guardNav}
              title={collapsed ? link.label : undefined}
            >
              <MaterialIcon name={link.icon} size={22} />
              {!collapsed && link.label}
            </Link>
          );
        })}

        {/* Autenticação */}
        <Show when="signed-out">
          <Link
            href="/entrar"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-left text-[--color-text-secondary] hover:bg-muted hover:text-foreground transition-colors ${collapsed ? 'justify-center' : ''}`}
            data-testid="sidebar-sign-in"
            onClick={guardNav}
            title={collapsed ? 'Entrar' : undefined}
          >
            <MaterialIcon name="login" size={22} />
            {!collapsed && 'Entrar'}
          </Link>
        </Show>
        <Show when="signed-in">
          <div className={`flex items-center gap-3 px-4 py-2 ${collapsed ? 'justify-center' : ''}`} data-testid="sidebar-user-button">
            <UserButton />
            {!collapsed && <span className="text-sm font-medium text-foreground">Minha conta</span>}
          </div>
        </Show>
      </div>
    </aside>
  );
}
