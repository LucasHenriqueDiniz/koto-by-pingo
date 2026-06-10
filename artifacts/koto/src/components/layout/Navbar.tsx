import { Link, useLocation } from 'wouter';
import { Logo } from '../brand/Logo';

const navLinks = [
  { href: '/kana', label: 'Kana' },
  { href: '/vocabulario', label: 'Vocabulário' },
  { href: '/escuta', label: 'Escuta' },
  { href: '/simulados', label: 'Simulados' },
  { href: '/progresso', label: 'Progresso' },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" data-testid="nav-logo">
          <Logo variant="horizontal" size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
          {navLinks.map(link => {
            const isActive = location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
