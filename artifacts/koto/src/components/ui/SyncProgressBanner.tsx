import { useState } from 'react';
import { useAuth } from '@clerk/react';
import { CloudUpload, Check, AlertTriangle } from 'lucide-react';
import { useCurrentUser } from '../../services/auth/auth.clerk';
import { syncProgressToRemote } from '../../services/progress/progress.remote';
import { hasSyncedToRemote, markSyncedToRemote } from '../../services/progress/progress.local';

interface SyncProgressBannerProps {
  hasLocalProgress: boolean;
}

/** Banner pós-login que oferece sincronizar o progresso local com a conta na nuvem (D1). */
export function SyncProgressBanner({ hasLocalProgress }: SyncProgressBannerProps) {
  const { isAuthenticated, user } = useCurrentUser();
  const { getToken } = useAuth();
  const [status, setStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');

  if (!isAuthenticated || !hasLocalProgress || hasSyncedToRemote() || status === 'done') {
    return null;
  }

  const handleSync = async () => {
    setStatus('syncing');
    try {
      await syncProgressToRemote(getToken, { displayName: user?.displayName, email: user?.email });
      markSyncedToRemote();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3" data-testid="sync-progress-banner">
      <div className="flex items-center gap-3">
        <CloudUpload size={20} className="text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Sincronize seu progresso</p>
          <p className="text-xs text-muted-foreground">
            {status === 'error'
              ? 'Não foi possível sincronizar agora. Tente novamente.'
              : 'Você tem progresso salvo neste dispositivo. Deseja vinculá-lo à sua conta?'}
          </p>
        </div>
      </div>
      <button
        onClick={handleSync}
        disabled={status === 'syncing'}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
        data-testid="sync-progress-btn"
      >
        {status === 'syncing' ? (
          'Sincronizando...'
        ) : status === 'error' ? (
          <>
            <AlertTriangle size={14} /> Tentar de novo
          </>
        ) : (
          <>
            <Check size={14} /> Sincronizar
          </>
        )}
      </button>
    </div>
  );
}
