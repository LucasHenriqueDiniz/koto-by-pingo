-- Migration 0002: word-level progress, kana attempt metadata, user preferences
-- Apply with: npx wrangler d1 migrations apply koto_by_pingo

ALTER TABLE kana_attempts ADD COLUMN mode TEXT;
ALTER TABLE kana_attempts ADD COLUMN kana_group TEXT;
ALTER TABLE kana_attempts ADD COLUMN skipped INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS word_progress (
  user_id TEXT NOT NULL,
  word_id TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  last_seen TEXT NOT NULL DEFAULT (datetime('now')),
  weak_reading INTEGER NOT NULL DEFAULT 0,
  weak_meaning INTEGER NOT NULL DEFAULT 0,
  weak_listening INTEGER NOT NULL DEFAULT 0,
  weak_typing INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, word_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  preferences_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_word_progress_user ON word_progress(user_id);
