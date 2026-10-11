-- Students table
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- Courses table
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE
);

-- Enrolments table (join table)
CREATE TABLE enrolments (
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  grade TEXT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO students (name, email) VALUES
('Amina', 'amina@example.com'),
('John', 'john@example.com'),
('Sara', 'sara@example.com');

INSERT INTO courses (title, code) VALUES
('Mathematics', 'MATH101'),
('History', 'HIST201'),
('Computer Science', 'CS301');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'C'),
(2, 3, 'B'),
(3, 3, 'A');

-- Queries

-- 1. All courses for one student (by name)
SELECT students.name, courses.title
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE students.name = 'Amina';

-- 2. All students on one course
SELECT courses.title, students.name
FROM courses
JOIN enrolments ON courses.id = enrolments.course_id
JOIN students ON students.id = enrolments.student_id
WHERE courses.title = 'Computer Science';

-- 3. Number of students per course
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.id;

-- 4. Students who have no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.course_id IS NULL;

-- 5. Update one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 2 AND course_id = 1;