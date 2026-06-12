import type { Env } from '../types';
import { jsonResponse } from '../cors';

export async function getPreferences(env: Env, userId: string, origin: string | null): Promise<Response> {
  const row = await env.DB.prepare('SELECT preferences_json FROM user_preferences WHERE user_id = ?').bind(userId).first<{ preferences_json: string }>();

  const preferences = row ? JSON.parse(row.preferences_json) : {};
  return jsonResponse({ preferences }, {}, origin);
}

export async function putPreferences(env: Env, userId: string, origin: string | null, body: unknown): Promise<Response> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return jsonResponse({ error: 'Corpo deve ser um objeto JSON' }, { status: 400 }, origin);
  }

  const now = new Date().toISOString();
  const json = JSON.stringify(body);

  await env.DB.prepare(
    `INSERT INTO user_preferences (user_id, preferences_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET preferences_json = excluded.preferences_json, updated_at = excluded.updated_at`,
  )
    .bind(userId, json, now)
    .run();

  return jsonResponse({ ok: true }, {}, origin);
}
