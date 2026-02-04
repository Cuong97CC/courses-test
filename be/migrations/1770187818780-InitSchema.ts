import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1770187818780 implements MigrationInterface {
  name = 'InitSchema1770187818780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."course_versions_visibility_enum" AS ENUM('PUBLIC', 'PRIVATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "course_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "summary" text NOT NULL, "content" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "capacity" integer NOT NULL, "visibility" "public"."course_versions_visibility_enum" NOT NULL, "version" integer NOT NULL, "changed_by_id" uuid NOT NULL, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc9e77578136a62e599f33d15ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."courses_visibility_enum" AS ENUM('PUBLIC', 'PRIVATE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "summary" text NOT NULL, "content" text NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "capacity" integer NOT NULL, "visibility" "public"."courses_visibility_enum" NOT NULL DEFAULT 'PUBLIC', "version" integer NOT NULL, "created_by_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."enrollments_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "course_id" uuid NOT NULL, "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'PENDING', "requested_at" TIMESTAMP NOT NULL, "processed_at" TIMESTAMP, "processed_by_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('STUDENT', 'INSTRUCTOR', 'MANAGER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'STUDENT', "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."courses_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "course_versions"`);
    await queryRunner.query(
      `DROP TYPE "public"."course_versions_visibility_enum"`,
    );
  }
}
