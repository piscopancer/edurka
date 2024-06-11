-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskType" ADD VALUE 'Line';
ALTER TYPE "TaskType" ADD VALUE 'Multiline';

-- DropForeignKey
ALTER TABLE "_participated-courses" DROP CONSTRAINT "_participated-courses_B_fkey";

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
