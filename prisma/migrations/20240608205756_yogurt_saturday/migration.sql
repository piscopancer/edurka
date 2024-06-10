/*
  Warnings:

  - You are about to drop the `_pc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tutorId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_pc" DROP CONSTRAINT "_pc_A_fkey";

-- DropForeignKey
ALTER TABLE "_pc" DROP CONSTRAINT "_pc_B_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "tutorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_pc";

-- CreateTable
CREATE TABLE "_participated-groups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_participated-courses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_courses-works" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_works-tasks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_participated-groups_AB_unique" ON "_participated-groups"("A", "B");

-- CreateIndex
CREATE INDEX "_participated-groups_B_index" ON "_participated-groups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_participated-courses_AB_unique" ON "_participated-courses"("A", "B");

-- CreateIndex
CREATE INDEX "_participated-courses_B_index" ON "_participated-courses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_courses-works_AB_unique" ON "_courses-works"("A", "B");

-- CreateIndex
CREATE INDEX "_courses-works_B_index" ON "_courses-works"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_works-tasks_AB_unique" ON "_works-tasks"("A", "B");

-- CreateIndex
CREATE INDEX "_works-tasks_B_index" ON "_works-tasks"("B");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-groups" ADD CONSTRAINT "_participated-groups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-groups" ADD CONSTRAINT "_participated-groups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courses-works" ADD CONSTRAINT "_courses-works_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courses-works" ADD CONSTRAINT "_courses-works_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_works-tasks" ADD CONSTRAINT "_works-tasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_works-tasks" ADD CONSTRAINT "_works-tasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
