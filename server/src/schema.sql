-- Gerno Database Schema
-- Run via: npm run migrate

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,                      -- null for Google-only users
  google_id     TEXT UNIQUE,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Circles (a Gerno journaling group)
CREATE TABLE IF NOT EXISTS circles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  total_days    INTEGER NOT NULL,
  start_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invite_code   TEXT NOT NULL UNIQUE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Circle Members (join table, ordered by join sequence)
CREATE TABLE IF NOT EXISTS circle_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id   UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  join_order  INTEGER NOT NULL,            -- 0-indexed rotation order
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (circle_id, user_id),
  UNIQUE (circle_id, join_order)
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id    UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number   INTEGER NOT NULL,           -- 1-indexed day in the circle
  title        TEXT,
  body         TEXT,
  photo_url    TEXT,
  word_count   INTEGER DEFAULT 0,
  is_draft     BOOLEAN DEFAULT TRUE,       -- FALSE = submitted/locked
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  UNIQUE (circle_id, day_number)           -- one entry per day per circle
);

-- Day Locks (missed day events)
CREATE TABLE IF NOT EXISTS day_locks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id    UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  day_number   INTEGER NOT NULL,
  action       TEXT NOT NULL CHECK (action IN ('skip', 'delay', 'pass')),
  triggered_by UUID REFERENCES users(id),
  resolved_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  circle_id  UUID REFERENCES circles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,             -- e.g. 'morning_reminder', 'evening_reminder', 'day_locked'
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_entries_circle_id ON entries(circle_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
