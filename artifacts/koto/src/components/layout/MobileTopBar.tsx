import { Link } from 'wouter';
import { Logo } from '../brand/Logo';

export function MobileTopBar() {
  return (
    <header
      className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      data-testid="mobile-top-bar"
    >
      <div className="px-4 h-14 flex items-center">
        <Link href="/">
          <Logo variant="horizontal" size="sm" />
        </Link>
      </div>
    </header>
  );
}
