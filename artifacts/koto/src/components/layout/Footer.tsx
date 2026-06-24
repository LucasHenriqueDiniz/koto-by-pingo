import { Link } from 'wouter';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg flex-shrink-0">
              <MaterialIcon name="translate" filled size={16} className="text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">Koto</span>
          </div>
          <p className="text-xs text-[--color-text-secondary] opacity-60">
            &copy; {new Date().getFullYear()} Pingo Concursos. Todos os direitos reservados.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4" aria-label="Links institucionais">
          {[
            { href: '/sobre', label: 'Sobre' },
            { href: '/privacidade', label: 'Privacidade' },
            { href: '/termos', label: 'Termos' },
            { href: '/contato', label: 'Contato' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[--color-text-secondary] hover:text-primary hover:underline transition-colors"
              data-testid={`footer-link-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
