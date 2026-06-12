import type { Env, SyncPayload, KanaAttemptInput, WordAttemptInput, ExamAttemptInput } from './types';
import { corsHeaders, jsonResponse } from './cors';
import { requireUserId, ensureUser } from './auth';
import { getProgress, syncProgress, resetProgress } from './handlers/progress';
import { recordKanaAttempt } from './handlers/kana';
import { recordVocabAttempt } from './handlers/vocab';
import { recordExamAttempt } from './handlers/exam';
import { getPreferences, putPreferences } from './handlers/preferences';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const { pathname } = new URL(request.url);

    const userId = await requireUserId(request, env);
    if (!userId) {
      return jsonResponse({ error: 'Não autenticado' }, { status: 401 }, origin);
    }

    let body: unknown;
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'JSON inválido' }, { status: 400 }, origin);
      }
    }

    if (pathname === '/api/progress/sync' && request.method === 'POST') {
      const payload = body as SyncPayload;
      await ensureUser(env.DB, userId, payload.displayName, payload.email);
      return syncProgress(env, userId, origin, payload);
    }

    if (pathname === '/api/progress' && request.method === 'GET') {
      await ensureUser(env.DB, userId);
      return getProgress(env, userId, origin);
    }

    if (pathname === '/api/progress/reset' && request.method === 'DELETE') {
      await ensureUser(env.DB, userId);
      return resetProgress(env, userId, origin);
    }

    if (pathname === '/api/kana/attempt' && request.method === 'POST') {
      await ensureUser(env.DB, userId);
      return recordKanaAttempt(env, userId, origin, body as KanaAttemptInput);
    }

    if (pathname === '/api/vocab/attempt' && request.method === 'POST') {
      await ensureUser(env.DB, userId);
      return recordVocabAttempt(env, userId, origin, body as WordAttemptInput);
    }

    if (pathname === '/api/exam/attempt' && request.method === 'POST') {
      await ensureUser(env.DB, userId);
      return recordExamAttempt(env, userId, origin, body as ExamAttemptInput);
    }

    if (pathname === '/api/user/preferences' && request.method === 'GET') {
      await ensureUser(env.DB, userId);
      return getPreferences(env, userId, origin);
    }

    if (pathname === '/api/user/preferences' && request.method === 'PUT') {
      await ensureUser(env.DB, userId);
      return putPreferences(env, userId, origin, body);
    }

    return jsonResponse({ error: 'Não encontrado' }, { status: 404 }, origin);
  },
} satisfies ExportedHandler<Env>;
