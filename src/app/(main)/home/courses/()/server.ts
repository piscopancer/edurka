import { db } from '#/prisma'

export async function queryCreatedCourses(tutorId: number) {
  return db.course.findMany({
    where: {
      tutorId,
    },
  })
}
