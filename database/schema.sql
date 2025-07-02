-- Optional: schema placeholder if using SQL directly
-- To add avatar and bio columns to the users table, run these in your SQLite client:
ALTER TABLE users ADD COLUMN avatar TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;

CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  config TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);