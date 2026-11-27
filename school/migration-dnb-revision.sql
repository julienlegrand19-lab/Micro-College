-- Apply once after migration-dnb.sql, before deploying V1.15 candidate.
-- Existing attempts are preserved. Do not run twice; check PRAGMA table_info(dnb_attempts).
ALTER TABLE dnb_attempts ADD COLUMN revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0);
