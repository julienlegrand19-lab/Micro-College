-- Seulement si l'ancien schema a déjà été installé. Exécuter une seule fois après sauvegarde.
CREATE TABLE progress_v3 (student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE, chapter TEXT NOT NULL CHECK(chapter IN ('relatifs','pyramides','litteral')), data TEXT NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY(student_id,chapter));
INSERT INTO progress_v3 SELECT student_id,chapter,data,updated_at FROM progress;
DROP TABLE progress;
ALTER TABLE progress_v3 RENAME TO progress;
