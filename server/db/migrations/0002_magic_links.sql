-- 0002_magic_links.sql
-- Magic-link tokens live in KV (with TTL) per the build spec; D1 only stores
-- per-email rate-limit counters and the most-recent login event audit log.

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  email_lower   TEXT PRIMARY KEY,
  hits          INTEGER NOT NULL DEFAULT 0,
  window_start  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS auth_events (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('request','consume','denied','expired')),
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_auth_events_email ON auth_events(email, created_at);
