import { Link } from 'wouter';
import { Show, UserButton } from '@clerk/react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export function MobileTopBar() {
  return (
    <header
      className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border"
      data-testid="mobile-top-bar"
    >
      <div className="px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg flex-shrink-0">
            <MaterialIcon name="translate" filled size={16} className="text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">Koto</span>
        </Link>

        <Show when="signed-out">
          <Link
            href="/entrar"
            aria-label="Entrar"
            className="p-2 rounded-lg text-[--color-text-secondary] hover:text-foreground hover:bg-muted transition-colors"
            data-testid="mobile-sign-in"
          >
            <MaterialIcon name="account_circle" size={24} />
          </Link>
        </Show>
        <Show when="signed-in">
          <div data-testid="mobile-user-button">
            <UserButton />
          </div>
        </Show>
      </div>
    </header>
  );
}
