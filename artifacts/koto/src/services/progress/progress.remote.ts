import { getKanaProgress, getWordProgress, getExamAttempts, getSessions } from './progress.local';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export type GetToken = () => Promise<string | null>;

export interface SyncResult {
  ok: true;
  synced: { kana: number; words: number; exams: number; sessions: number };
}

export interface RemoteProgress {
  summary: Record<string, unknown> | null;
  wordProgress: unknown[];
  kanaAttempts: unknown[];
  exams: unknown[];
  sessions: unknown[];
}

async function authedFetch(path: string, getToken: GetToken, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body) headers.set('Content-Type', 'application/json');

  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}

/** Envia todo o progresso local (kana, vocabulário, simulados, sessões) para a conta Clerk do usuário. */
export async function syncProgressToRemote(getToken: GetToken, profile?: { displayName?: string; email?: string }): Promise<SyncResult> {
  const payload = {
    displayName: profile?.displayName,
    email: profile?.email,
    kana: getKanaProgress().attempts,
    wordProgress: getWordProgress(),
    exams: getExamAttempts(),
    sessions: getSessions(),
  };

  const res = await authedFetch('/api/progress/sync', getToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Falha ao sincronizar progresso (HTTP ${res.status})`);
  }

  return res.json();
}

/** Busca o progresso salvo na conta Clerk do usuário no D1. */
export async function fetchProgressFromRemote(getToken: GetToken): Promise<RemoteProgress | null> {
  const res = await authedFetch('/api/progress', getToken, { method: 'GET' });

  if (!res.ok) {
    throw new Error(`Falha ao buscar progresso remoto (HTTP ${res.status})`);
  }

  return res.json();
}
