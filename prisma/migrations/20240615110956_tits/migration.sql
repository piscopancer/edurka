/*
  Warnings:

  - The values [Agree,SelectOne,SelectMany,FillGaps,Reply] on the enum `AnswerType` will be removed. If these variants are still used in the database, this will fail.
  - The values [AddedToCourse,AddedToGroup] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Agree,SelectOne,SelectMany,FillGaps,Reply] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AnswerType_new" AS ENUM ('AgreeAnswer', 'SelectOneAnswer', 'SelectManyAnswer', 'FillGapsAnswer', 'ReplyAnswer');
ALTER TABLE "Answer" ALTER COLUMN "type" TYPE "AnswerType_new" USING ("type"::text::"AnswerType_new");
ALTER TYPE "AnswerType" RENAME TO "AnswerType_old";
ALTER TYPE "AnswerType_new" RENAME TO "AnswerType";
DROP TYPE "AnswerType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('AddedToCourseNotification', 'AddedToGroupNotification');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskType_new" AS ENUM ('AgreeTask', 'SelectOneTask', 'SelectManyTask', 'FillGapsTask', 'ReplyTask');
ALTER TABLE "Task" ALTER COLUMN "type" TYPE "TaskType_new" USING ("type"::text::"TaskType_new");
ALTER TYPE "TaskType" RENAME TO "TaskType_old";
ALTER TYPE "TaskType_new" RENAME TO "TaskType";
DROP TYPE "TaskType_old";
COMMIT;
