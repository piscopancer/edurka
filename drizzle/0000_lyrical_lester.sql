CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tutor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tutor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_courses_participation" (
	"participant_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	CONSTRAINT "users_courses_participation_participant_id_course_id_pk" PRIMARY KEY("participant_id","course_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_groups_participation" (
	"participant_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "users_groups_participation_group_id_participant_id_pk" PRIMARY KEY("group_id","participant_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"confirmed" boolean DEFAULT false,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"middlename" text,
	"admin" boolean DEFAULT false,
	"tutor" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_login_unique" UNIQUE("login"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "works_tasks" (
	"work_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	CONSTRAINT "works_tasks_work_id_task_id_pk" PRIMARY KEY("work_id","task_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "works" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"tutor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agree_tasks" (
	"task_base_id" integer PRIMARY KEY NOT NULL,
	"correct_answer" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "select_one_tasks" (
	"task_base_id" integer PRIMARY KEY NOT NULL,
	"options" text[] NOT NULL,
	"correct_answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks_bases" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"description" text,
	"tutor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_courses_participation" ADD CONSTRAINT "users_courses_participation_participant_id_users_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_courses_participation" ADD CONSTRAINT "users_courses_participation_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_groups_participation" ADD CONSTRAINT "users_groups_participation_participant_id_users_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_groups_participation" ADD CONSTRAINT "users_groups_participation_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "works_tasks" ADD CONSTRAINT "works_tasks_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "works_tasks" ADD CONSTRAINT "works_tasks_task_id_tasks_bases_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks_bases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "works" ADD CONSTRAINT "works_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agree_tasks" ADD CONSTRAINT "agree_tasks_task_base_id_tasks_bases_id_fk" FOREIGN KEY ("task_base_id") REFERENCES "public"."tasks_bases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "select_one_tasks" ADD CONSTRAINT "select_one_tasks_task_base_id_tasks_bases_id_fk" FOREIGN KEY ("task_base_id") REFERENCES "public"."tasks_bases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_bases" ADD CONSTRAINT "tasks_bases_tutor_id_users_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
