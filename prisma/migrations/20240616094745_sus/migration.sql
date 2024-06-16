/*
  Warnings:

  - The primary key for the `Attempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `courseId` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_pkey",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD CONSTRAINT "Attempt_pkey" PRIMARY KEY ("studentId", "workId", "courseId");

-- CreateTable
CREATE TABLE "WorkState" (
    "enabledUntil" TIMESTAMP(3),
    "workId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "WorkState_pkey" PRIMARY KEY ("workId","courseId")
);

-- CreateTable
CREATE TABLE "TaskState" (
    "disabled" BOOLEAN,
    "taskId" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "TaskState_pkey" PRIMARY KEY ("taskId","workId")
);

-- AddForeignKey
ALTER TABLE "WorkState" ADD CONSTRAINT "WorkState_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkState" ADD CONSTRAINT "WorkState_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
