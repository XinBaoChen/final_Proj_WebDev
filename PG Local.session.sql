-- Postgres SQL session for local validation (run in SQLTools or psql)
-- Schema: all app tables live under schema `campuses`

-- Ensure schema exists and use it for this session
CREATE SCHEMA IF NOT EXISTS campuses;
SET search_path TO campuses;

-- Inspect environment
SELECT current_database(), current_schema();
SELECT table_schema, table_name FROM information_schema.tables
WHERE table_schema = 'campuses' AND table_name IN ('campuses','students')
ORDER BY table_name;

-- Column listings (note quoted camelCase identifiers)
SELECT column_name FROM information_schema.columns
WHERE table_schema='campuses' AND table_name='campuses' ORDER BY ordinal_position;
SELECT column_name FROM information_schema.columns
WHERE table_schema='campuses' AND table_name='students' ORDER BY ordinal_position;

-- Seed visibility checks (should show seeded rows if SEED_DB=true)
SELECT id, name, address, "imageUrl" FROM campuses ORDER BY id;
SELECT id, firstname, lastname, email, gpa, "campusId" FROM students ORDER BY id;

-- Create a new campus
INSERT INTO campuses (name, address, description, "imageUrl", "createdAt", "updatedAt")
VALUES ('Test Campus', '123 Main St, City, ST', 'Added via SQL session', 'https://example.com/campus.jpg', NOW(), NOW())
RETURNING id;

-- Find the campus id you just inserted (if RETURNING not supported in your client)
SELECT id, name FROM campuses ORDER BY id DESC LIMIT 1;

-- Create a new student NOT enrolled (no campusId)
INSERT INTO students (firstname, lastname, email, "imageUrl", gpa, "createdAt", "updatedAt")
VALUES ('Alice', 'Anderson', 'alice.anderson@example.com', 'https://example.com/alice.jpg', 3.5, NOW(), NOW())
RETURNING id;

-- Enroll the student to a campus by updating the FK (replace 1 with your campus id)
UPDATE students SET "campusId" = 1, "updatedAt" = NOW() WHERE email = 'alice.anderson@example.com'
RETURNING id, firstname, lastname, email, "campusId";

-- Verify join shows campus name
SELECT s.id, s.firstname, s.lastname, s.email, s."campusId", c.name AS campus_name
FROM students s
LEFT JOIN campuses c ON s."campusId" = c.id
ORDER BY s.id;

-- Edit student (update GPA)
UPDATE students SET gpa = 3.9, "updatedAt" = NOW() WHERE email = 'alice.anderson@example.com'
RETURNING id, firstname, lastname, email, gpa;

-- Delete student
DELETE FROM students WHERE email = 'alice.anderson@example.com'
RETURNING id, firstname, lastname, email;

-- Delete campus (onDelete for FK is SET NULL; students referencing it will be preserved and disassociated)
-- Replace 1 with the campus id you created above.
DELETE FROM campuses WHERE id = 1
RETURNING id, name;

-- Confirm any students that pointed at the deleted campus now have NULL campusId
SELECT id, firstname, lastname, email, "campusId" FROM students WHERE "campusId" IS NULL ORDER BY id;

-- Final counts
SELECT 'campuses' AS table, COUNT(*) AS rows FROM campuses
UNION ALL
SELECT 'students' AS table, COUNT(*) AS rows FROM students;

-- Constraint sanity: ensure FK exists on students(campusId)
SELECT tc.constraint_name, tc.table_schema, tc.table_name, kcu.column_name, ccu.table_schema AS foreign_table_schema,
             ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'campuses' AND tc.table_name = 'students';