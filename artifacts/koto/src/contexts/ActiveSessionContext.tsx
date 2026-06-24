import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export const CONFIRM_LEAVE_SESSION_MESSAGE =
  'Você tem um treino em andamento. Sair agora vai descartar o progresso desta sessão. Deseja continuar?';

interface ActiveSessionContextValue {
  isSessionActive: boolean;
  setSessionActive: (active: boolean) => void;
}

const ActiveSessionContext = createContext<ActiveSessionContextValue | null>(null);

export function ActiveSessionProvider({ children }: { children: ReactNode }) {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const setSessionActive = useCallback((active: boolean) => {
    setIsSessionActive(active);
  }, []);

  useEffect(() => {
    if (!isSessionActive) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isSessionActive]);

  return (
    <ActiveSessionContext.Provider value={{ isSessionActive, setSessionActive }}>
      {children}
    </ActiveSessionContext.Provider>
  );
}

export function useActiveSession() {
  const ctx = useContext(ActiveSessionContext);
  if (!ctx) throw new Error('useActiveSession must be used within ActiveSessionProvider');
  return ctx;
}

export function useRegisterActiveSession(active: boolean) {
  const { setSessionActive } = useActiveSession();
  useEffect(() => {
    setSessionActive(active);
    return () => setSessionActive(false);
  }, [active, setSessionActive]);
}
