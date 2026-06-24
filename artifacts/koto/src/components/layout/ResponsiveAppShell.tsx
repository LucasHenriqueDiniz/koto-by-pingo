import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTopBar } from './MobileTopBar';
import { Footer } from './Footer';

interface ResponsiveAppShellProps {
  children: React.ReactNode;
}

export function ResponsiveAppShell({ children }: ResponsiveAppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar (lg+) */}
      <DesktopSidebar />

      {/* Mobile top bar (< lg) */}
      <MobileTopBar />

      {/* Main content — offset for sidebar on desktop, top bar on mobile */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>

        {/* Desktop footer */}
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
