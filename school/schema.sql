-- Apply to a new D1 database before activating the online mode.
CREATE TABLE IF NOT EXISTS students (
 id TEXT PRIMARY KEY, pseudo TEXT NOT NULL, classroom TEXT NOT NULL,
 password_mac TEXT NOT NULL, appearance TEXT NOT NULL DEFAULT '{}',
 created_at INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS sessions (
 token_mac TEXT PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('teacher','student')),
 student_id TEXT REFERENCES students(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_student ON sessions(student_id);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS progress (
 student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
 chapter TEXT NOT NULL CHECK(chapter IN ('relatifs','pyramides')),
 data TEXT NOT NULL, updated_at INTEGER NOT NULL,
 PRIMARY KEY(student_id,chapter)
);
CREATE TABLE IF NOT EXISTS login_limits (
 bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS login_expiry ON login_limits(expires_at);
