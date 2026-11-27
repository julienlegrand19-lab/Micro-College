-- Apply BEFORE deploying worker-dnb-candidate.js. Existing 4e tables remain unchanged.
CREATE TABLE IF NOT EXISTS dnb_attempts (
 student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
 assignment TEXT NOT NULL,
 questions TEXT NOT NULL,
 answers TEXT NOT NULL,
 position INTEGER NOT NULL DEFAULT 0 CHECK(position BETWEEN 0 AND 23),
 created_at INTEGER NOT NULL,
 submitted_at INTEGER,
 PRIMARY KEY(student_id,assignment)
);
CREATE INDEX IF NOT EXISTS dnb_submission ON dnb_attempts(assignment,submitted_at);
