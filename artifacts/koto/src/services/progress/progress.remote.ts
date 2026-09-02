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
    throw new Error('User is not authenticated.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body) headers.set('Content-Type', 'application/json');

  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}

/** Pushes all local progress (kana, vocabulary, mock exams, sessions) to the user's Clerk account. */
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
    throw new Error(`Failed to sync progress (HTTP ${res.status})`);
  }

  return res.json();
}

/** Fetches the progress stored in the user's Clerk account on D1. */
export async function fetchProgressFromRemote(getToken: GetToken): Promise<RemoteProgress | null> {
  const res = await authedFetch('/api/progress', getToken, { method: 'GET' });

  if (!res.ok) {
    throw new Error(`Failed to fetch remote progress (HTTP ${res.status})`);
  }

  return res.json();
}
