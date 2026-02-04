import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1770021690371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Users (passwords are hashed version of "password123")
    await queryRunner.query(`
      INSERT INTO "users" ("id", "email", "password", "role", "first_name", "last_name") VALUES
      -- Managers
      ('11111111-1111-1111-1111-111111111111', 'manager1@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'MANAGER', 'Alice', 'Johnson'),
      ('11111111-1111-1111-1111-111111111112', 'manager2@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'MANAGER', 'Bob', 'Williams'),
      
      -- Instructors
      ('22222222-2222-2222-2222-222222222221', 'instructor1@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'INSTRUCTOR', 'Carol', 'Davis'),
      ('22222222-2222-2222-2222-222222222222', 'instructor2@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'INSTRUCTOR', 'David', 'Miller'),
      ('22222222-2222-2222-2222-222222222223', 'instructor3@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'INSTRUCTOR', 'Emma', 'Wilson'),
      
      -- Students
      ('33333333-3333-3333-3333-333333333331', 'student1@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'STUDENT', 'Frank', 'Brown'),
      ('33333333-3333-3333-3333-333333333332', 'student2@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'STUDENT', 'Grace', 'Taylor'),
      ('33333333-3333-3333-3333-333333333333', 'student3@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'STUDENT', 'Henry', 'Anderson'),
      ('33333333-3333-3333-3333-333333333334', 'student4@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'STUDENT', 'Ivy', 'Thomas'),
      ('33333333-3333-3333-3333-333333333335', 'student5@example.com', '$2b$10$cApFT4OzN/Skugx36gDPNO8Snd0cY.yJ01oODd9KNCPgkKYqdAXVO', 'STUDENT', 'Jack', 'Martinez');
    `);

    // Insert Courses
    await queryRunner.query(`
      INSERT INTO "courses" ("id", "title", "summary", "content", "start_date", "end_date", "capacity", "visibility", "version", "created_by_id") VALUES
      -- Public courses
      ('44444444-4444-4444-4444-444444444441', 
       'Introduction to Web Development', 
       'Learn the fundamentals of web development including HTML, CSS, and JavaScript', 
       'This comprehensive course covers HTML5, CSS3, JavaScript ES6+, responsive design, and modern web development practices. Students will build real-world projects and learn industry best practices.',
       '2026-03-01', '2026-05-15', 30, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222221'),
      
      ('44444444-4444-4444-4444-444444444442', 
       'Advanced TypeScript', 
       'Deep dive into TypeScript features and best practices', 
       'Master TypeScript with advanced topics including generics, decorators, advanced types, compiler configuration, and integration with popular frameworks.',
       '2026-03-15', '2026-06-01', 25, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222222'),
      
      ('44444444-4444-4444-4444-444444444443', 
       'Database Design and SQL', 
       'Learn relational database design and SQL querying', 
       'Comprehensive course covering database normalization, ER diagrams, SQL queries, transactions, indexes, and performance optimization.',
       '2026-04-01', '2026-06-30', 35, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222223'),
      
      -- Private course
      ('44444444-4444-4444-4444-444444444444', 
       'Enterprise Architecture Patterns', 
       'Advanced architectural patterns for enterprise applications', 
       'This private course covers microservices, event-driven architecture, CQRS, domain-driven design, and scalability patterns.',
       '2026-05-01', '2026-07-31', 15, 'PRIVATE', 1, '22222222-2222-2222-2222-222222222221'),
      
      -- Upcoming course
      ('44444444-4444-4444-4444-444444444445', 
       'React and Next.js Masterclass', 
       'Build modern web applications with React and Next.js', 
       'Learn React hooks, state management, server components, Next.js 14 features, and deployment strategies.',
       '2026-06-01', '2026-08-15', 40, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222222');
    `);

    // Insert Course Versions (version history)
    await queryRunner.query(`
      INSERT INTO "course_versions" ("id", "course_id", "title", "summary", "content", "start_date", "end_date", "capacity", "visibility", "version", "changed_by_id") VALUES
      -- Initial version of Web Development course
      ('55555555-5555-5555-5555-555555555551', 
       '44444444-4444-4444-4444-444444444441',
       'Introduction to Web Development', 
       'Learn the fundamentals of web development including HTML, CSS, and JavaScript', 
       'This comprehensive course covers HTML5, CSS3, JavaScript ES6+, responsive design, and modern web development practices. Students will build real-world projects and learn industry best practices.',
       '2026-03-01', '2026-05-15', 30, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222221'),
      
      -- Initial version of TypeScript course
      ('55555555-5555-5555-5555-555555555552', 
       '44444444-4444-4444-4444-444444444442',
       'Advanced TypeScript', 
       'Deep dive into TypeScript features and best practices', 
       'Master TypeScript with advanced topics including generics, decorators, advanced types, compiler configuration, and integration with popular frameworks.',
       '2026-03-15', '2026-06-01', 25, 'PUBLIC', 1, '22222222-2222-2222-2222-222222222222');
    `);

    // Insert Enrollments
    await queryRunner.query(`
      INSERT INTO "enrollments" ("id", "student_id", "course_id", "status", "requested_at", "processed_at", "processed_by_id") VALUES
      -- Approved enrollments for Web Development course
      ('66666666-6666-6666-6666-666666666661', 
       '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 
       'APPROVED', '2026-02-15 10:00:00', '2026-02-15 14:30:00', '22222222-2222-2222-2222-222222222221'),
      
      ('66666666-6666-6666-6666-666666666662', 
       '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444441', 
       'APPROVED', '2026-02-16 09:00:00', '2026-02-16 11:00:00', '22222222-2222-2222-2222-222222222221'),
      
      ('66666666-6666-6666-6666-666666666663', 
       '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444441', 
       'APPROVED', '2026-02-17 13:00:00', '2026-02-17 15:00:00', '22222222-2222-2222-2222-222222222221'),
      
      -- Approved enrollments for TypeScript course
      ('66666666-6666-6666-6666-666666666664', 
       '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', 
       'APPROVED', '2026-02-18 10:00:00', '2026-02-18 12:00:00', '22222222-2222-2222-2222-222222222222'),
      
      ('66666666-6666-6666-6666-666666666665', 
       '33333333-3333-3333-3333-333333333334', '44444444-4444-4444-4444-444444444442', 
       'APPROVED', '2026-02-19 11:00:00', '2026-02-19 14:00:00', '22222222-2222-2222-2222-222222222222'),
      
      -- Pending enrollments
      ('66666666-6666-6666-6666-666666666666', 
       '33333333-3333-3333-3333-333333333332', '44444444-4444-4444-4444-444444444443', 
       'PENDING', '2026-02-20 09:00:00', NULL, NULL),
      
      ('66666666-6666-6666-6666-666666666667', 
       '33333333-3333-3333-3333-333333333335', '44444444-4444-4444-4444-444444444443', 
       'PENDING', '2026-02-20 10:00:00', NULL, NULL),
      
      -- Rejected enrollment
      ('66666666-6666-6666-6666-666666666668', 
       '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 
       'REJECTED', '2026-02-21 09:00:00', '2026-02-21 15:00:00', '11111111-1111-1111-1111-111111111111'),
      
      -- Cancelled enrollment
      ('66666666-6666-6666-6666-666666666669', 
       '33333333-3333-3333-3333-333333333334', '44444444-4444-4444-4444-444444444441', 
       'CANCELLED', '2026-02-22 08:00:00', '2026-02-22 09:00:00', '33333333-3333-3333-3333-333333333334');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order due to foreign key constraints
    await queryRunner.query(`DELETE FROM "enrollments"`);
    await queryRunner.query(`DELETE FROM "course_versions"`);
    await queryRunner.query(`DELETE FROM "courses"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
