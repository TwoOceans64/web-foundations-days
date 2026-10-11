# School Database Design

## Tables
- **students**: Holds student info (id, name, email). Email is UNIQUE to prevent duplicates.
- **courses**: Holds course info (id, title, code). Code is UNIQUE to identify each course.
- **enrolments**: Join table linking students and courses, with a grade column. Composite primary key (student_id, course_id) prevents duplicate enrolments.

## Relationships
- One-to-many: A student can have many enrolments; a course can have many enrolments.
- Many-to-many: Students and courses are linked through enrolments, which is why the join table is needed.

## Index
I would add an index on `enrolments(course_id)` to speed up queries that count or list students per course, since those queries filter/group by course_id frequently.

## SQL vs NoSQL
For this system, SQL is the better choice. The relationships are structured and relational (students ↔ courses), and queries often involve joins and aggregations. NoSQL would be less efficient for enforcing uniqueness and relational integrity here.