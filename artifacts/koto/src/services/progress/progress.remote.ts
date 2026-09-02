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

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  // A wrong API_BASE_URL does not fail the way a broken request does, and that is the whole reason
  // this check exists. When the value is empty the request goes to this app's own origin, where the
  // SPA catch-all answers `200 text/html` for any unmatched path — so `response.ok` is true, every
  // status check downstream passes, and the failure only surfaces as `Unexpected token '<'` out of
  // `response.json()`. Naming the cause here costs one header read and saves that hunt.
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Expected JSON from ${API_BASE_URL || 'this origin'}${path} but got "${contentType || 'no content type'}" ` +
        `(HTTP ${response.status}). The API is a separate Worker: set VITE_API_BASE_URL to its URL at build time.`,
    );
  }

  return response;
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
