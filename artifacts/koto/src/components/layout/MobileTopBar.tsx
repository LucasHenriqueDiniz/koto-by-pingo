import { Link } from 'wouter';
import { CircleUserRound } from 'lucide-react';
import { Show, SignInButton, UserButton } from '@clerk/react';
import { Logo } from '../brand/Logo';

export function MobileTopBar() {
  return (
    <header
      className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      data-testid="mobile-top-bar"
    >
      <div className="px-4 h-14 flex items-center justify-between">
        <Link href="/">
          <Logo variant="horizontal" size="sm" />
        </Link>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              type="button"
              aria-label="Entrar"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid="mobile-sign-in"
            >
              <CircleUserRound size={22} strokeWidth={1.8} />
            </button>
          </SignInButton>
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
