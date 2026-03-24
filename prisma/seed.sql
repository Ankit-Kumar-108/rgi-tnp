-- Seed StudentMaster
INSERT INTO "StudentMaster" ("id", "enrollmentNumber", "name", "branch", "batch")
VALUES ('cuid_student_01', '0158CS241012', 'Ankit Kumar', 'Computer Science', 2028)
ON CONFLICT("enrollmentNumber") DO UPDATE SET "name" = excluded."name";

-- Seed AlumniMaster
INSERT INTO "AlumniMaster" ("id", "enrollmentNumber", "name", "branch", "batch")
VALUES ('cuid_alumni_01', '0108CS201001', 'Jane Doe', 'Information Technology', '2024')
ON CONFLICT("enrollmentNumber") DO UPDATE SET "name" = excluded."name";
