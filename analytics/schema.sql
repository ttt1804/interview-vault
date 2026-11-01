-- Interview Vault — schema tài khoản (Cloudflare D1 = SQLite)
-- Chạy: wrangler d1 execute iv-analytics --remote --file=schema.sql

-- ─────────────────────────────────────────────────────────────────────────────
-- Tài khoản người dùng (đăng nhập Google) — tuỳ chọn, chỉ để đồng bộ tiến độ
-- học đa thiết bị.
-- ─────────────────────────────────────────────────────────────────────────────

-- Một dòng cho mỗi người đăng nhập. sub = Google subject id (ổn định, không đổi).
CREATE TABLE IF NOT EXISTS app_user (
  sub                TEXT PRIMARY KEY,
  email              TEXT,
  name               TEXT,
  picture            TEXT,
  display_name       TEXT,                       -- không còn dùng (từ bảng xếp hạng cũ)
  show_on_leaderboard INTEGER NOT NULL DEFAULT 0, -- không còn dùng
  created_day        TEXT NOT NULL,
  last_seen_day      TEXT NOT NULL
);

-- Tiến độ học của mỗi người: một blob JSON { srs, learned, log, resets }.
CREATE TABLE IF NOT EXISTS user_progress (
  sub        TEXT PRIMARY KEY,
  data       TEXT NOT NULL DEFAULT '{}',
  rev        INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

-- Dữ liệu cũ của bảng xếp hạng, không còn ghi thêm. Cron dọn dần, xoá tài khoản xoá luôn.
CREATE TABLE IF NOT EXISTS user_activity_day (
  sub     TEXT NOT NULL,
  day     TEXT NOT NULL,
  reviews INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (sub, day)
);
CREATE INDEX IF NOT EXISTS idx_user_activity_day ON user_activity_day (day);

-- Quyền truy cập nội dung premium. Cấp thủ công qua POST /admin/grant.
CREATE TABLE IF NOT EXISTS user_entitlement (
  sub        TEXT PRIMARY KEY,
  tier       TEXT NOT NULL DEFAULT 'free',       -- 'free' | 'premium'
  expires_at INTEGER,                            -- null = vĩnh viễn
  granted_at INTEGER NOT NULL,
  note       TEXT
);
