import { ResponsiveAppShell } from './ResponsiveAppShell';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ResponsiveAppShell>
      {children}
    </ResponsiveAppShell>
  );
}
