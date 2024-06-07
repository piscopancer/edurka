'use server'

import { db } from '#/prisma'

async function _searchStudents(tutorId: number, search: string) {
  const res = db.user.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
      middlename: true,
      participatedCourses: {
        select: {
          _count: true,
        },
        where: {
          tutorId,
        },
      },
    },
    where: {
      id: {
        not: tutorId,
      },
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { surname: { contains: search, mode: 'insensitive' } },
        { middlename: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    },
  })
  return res
}
export async function searchStudents({ tutorId, search }: { tutorId: number; search: string }) {
  return _searchStudents.bind(null, tutorId, search)()
}
