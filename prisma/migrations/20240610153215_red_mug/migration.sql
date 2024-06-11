-- DropForeignKey
ALTER TABLE "_participated-courses" DROP CONSTRAINT "_participated-courses_B_fkey";

-- AddForeignKey
ALTER TABLE "_participated-courses" ADD CONSTRAINT "_participated-courses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
