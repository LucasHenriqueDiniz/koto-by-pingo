import { useEffect, useRef } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTopBar } from './MobileTopBar';
import { Footer } from './Footer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useActiveSession } from '../../contexts/ActiveSessionContext';
import { getSettings } from '../../services/settings/settings.local';

interface ResponsiveAppShellProps {
  children: React.ReactNode;
}

export function ResponsiveAppShell({ children }: ResponsiveAppShellProps) {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar_collapsed', false);
  const { isSessionActive } = useActiveSession();
  const autoCollapsedRef = useRef(false);

  const toggleCollapsed = () => {
    autoCollapsedRef.current = false;
    setCollapsed(c => !c);
  };

  useEffect(() => {
    if (!getSettings().autoCollapseSidebarInTraining) return;

    if (isSessionActive) {
      setCollapsed(current => {
        if (!current) {
          autoCollapsedRef.current = true;
          return true;
        }
        return current;
      });
    } else if (autoCollapsedRef.current) {
      autoCollapsedRef.current = false;
      setCollapsed(false);
    }
  }, [isSessionActive, setCollapsed]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar (lg+) */}
      <DesktopSidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />

      {/* Mobile top bar (< lg) */}
      <MobileTopBar />

      {/* Main content — offset for sidebar on desktop, top bar on mobile */}
      <div className={`flex flex-col min-h-screen transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>

        {/* Desktop footer — escondido durante treino/simulado ativo */}
        {!isSessionActive && (
          <div className="hidden lg:block">
            <Footer />
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
