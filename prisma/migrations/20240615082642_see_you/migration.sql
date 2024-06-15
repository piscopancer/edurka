-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "middlename" TEXT,
    "email" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "tutor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddedToGroupNotification" (
    "id" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "AddedToGroupNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddedToCourseNotification" (
    "id" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "AddedToCourseNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutorId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tutorId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "tutorId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgreeTask" (
    "id" INTEGER NOT NULL,
    "correctAnswer" BOOLEAN NOT NULL,

    CONSTRAINT "AgreeTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectOneTask" (
    "id" INTEGER NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER NOT NULL,

    CONSTRAINT "SelectOneTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectManyTask" (
    "id" INTEGER NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER[],

    CONSTRAINT "SelectManyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillGapsTask" (
    "id" INTEGER NOT NULL,
    "document" JSONB NOT NULL,

    CONSTRAINT "FillGapsTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyTask" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "ReplyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("studentId","workId")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgreeAnswer" (
    "id" INTEGER NOT NULL,
    "answer" BOOLEAN,

    CONSTRAINT "AgreeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectOneAnswer" (
    "id" INTEGER NOT NULL,
    "answer" INTEGER,

    CONSTRAINT "SelectOneAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectManyAnswer" (
    "id" INTEGER NOT NULL,
    "answer" INTEGER[],

    CONSTRAINT "SelectManyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillGapsAnswer" (
    "id" INTEGER NOT NULL,
    "answer" INTEGER[],

    CONSTRAINT "FillGapsAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyAnswer" (
    "id" INTEGER NOT NULL,
    "answer" JSONB NOT NULL,

    CONSTRAINT "ReplyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_participated-groups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_courses-works" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_participated-courses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_works-tasks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_participated-groups_AB_unique" ON "_participated-groups"("A", "B");

-- CreateIndex
CREATE INDEX "_participated-groups_B_index" ON "_participated-groups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToGroup_AB_unique" ON "_CourseToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToGroup_B_index" ON "_CourseToGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_courses-works_AB_unique" ON "_courses-works"("A", "B");

-- CreateIndex
CREATE INDEX "_courses-works_B_index" ON "_courses-works"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_participated-courses_AB_unique" ON "_participated-courses"("A", "B");

-- CreateIndex
CREATE INDEX "_participated-courses_B_index" ON "_participated-courses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_works-tasks_AB_unique" ON "_works-tasks"("A", "B");

-- CreateIndex
CREATE INDEX "_works-tasks_B_index" ON "_works-tasks"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedToGroupNotification" ADD CONSTRAINT "AddedToGroupNotification_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedToGroupNotification" ADD CONSTRAINT "AddedToGroupNotification_id_fkey" FOREIGN KEY ("id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedToCourseNotification" ADD CONSTRAINT "AddedToCourseNotification_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddedToCourseNotification" ADD CONSTRAINT "AddedToCourseNotification_id_fkey" FOREIGN KEY ("id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgreeTask" ADD CONSTRAINT "AgreeTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectOneTask" ADD CONSTRAINT "SelectOneTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectManyTask" ADD CONSTRAINT "SelectManyTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillGapsTask" ADD CONSTRAINT "FillGapsTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyTask" ADD CONSTRAINT "ReplyTask_id_fkey" FOREIGN KEY ("id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgreeAnswer" ADD CONSTRAINT "AgreeAnswer_id_fkey" FOREIGN KEY ("id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectOneAnswer" ADD CONSTRAINT "SelectOneAnswer_id_fkey" FOREIGN KEY ("id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectManyAnswer" ADD CONSTRAINT "SelectManyAnswer_id_fkey" FOREIGN KEY ("id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillGapsAnswer" ADD CONSTRAINT "FillGapsAnswer_id_fkey" FOREIGN KEY ("id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyAnswer" ADD CONSTRAINT "ReplyAnswer_id_fkey" FOREIGN KEY ("id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-groups" ADD CONSTRAINT "_participated-groups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-groups" ADD CONSTRAINT "_participated-groups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGroup" ADD CONSTRAINT "_CourseToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToGroup" ADD CONSTRAINT "_CourseToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courses-works" ADD CONSTRAINT "_courses-works_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courses-works" ADD CONSTRAINT "_courses-works_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_works-tasks" ADD CONSTRAINT "_works-tasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_works-tasks" ADD CONSTRAINT "_works-tasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
