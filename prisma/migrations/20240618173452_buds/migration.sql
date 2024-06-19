/*
  Warnings:

  - A unique constraint covering the columns `[courseId]` on the table `AddedToCourseNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId]` on the table `AddedToGroupNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AddedToCourseNotification_courseId_key" ON "AddedToCourseNotification"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "AddedToGroupNotification_groupId_key" ON "AddedToGroupNotification"("groupId");
