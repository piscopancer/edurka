/*
  Warnings:

  - The values [AddedToCourseNotification,AddedToGroupNotification] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('Agree', 'SelectOne', 'SelectMany', 'FillGaps', 'Reply');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('Agree', 'SelectOne', 'SelectMany', 'FillGaps', 'Reply');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('AddedToCourse', 'AddedToGroup');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "type",
ADD COLUMN     "type" "AnswerType" NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "type",
ADD COLUMN     "type" "TaskType" NOT NULL;
