import { Link } from 'wouter';
import { Logo } from '../brand/Logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Logo variant="horizontal" size="sm" />
            <p className="text-sm text-muted-foreground max-w-sm">
              Koto by Pingo é um app independente para treino de japonês, feito para estudantes brasileiros.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Links institucionais">
            {[
              { href: '/sobre', label: 'Sobre' },
              { href: '/privacidade', label: 'Privacidade' },
              { href: '/termos', label: 'Termos' },
              { href: '/contato', label: 'Contato' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`footer-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pingo Concursos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
