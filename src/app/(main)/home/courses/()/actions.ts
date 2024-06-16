'use server'

import { db } from '#/prisma'

// async function _searchStudents(tutorId: number, search: string) {
//   const res = db.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       surname: true,
//       middlename: true,
//       participatedCourses: {
//         select: {
//           _count: true,
//         },
//         where: {
//           tutorId,
//         },
//       },
//     },
//     where: {
//       id: {
//         not: tutorId,
//       },
//       OR: [
//         { name: { contains: search, mode: 'insensitive' } },
//         { surname: { contains: search, mode: 'insensitive' } },
//         { middlename: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } },
//       ],
//     },
//   })
//   return res
// }
// export async function searchStudents({ tutorId, search }: { tutorId: number; search: string }) {
//   return _searchStudents.bind(null, tutorId, search)()
// }

async function _findGroups(search: string) {
  const res = db.group.findMany({
    select: {
      id: true,
      createdAt: true,
      title: true,
      _count: {
        select: {
          students: true,
        },
      },
    },
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        {
          students: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { surname: { contains: search, mode: 'insensitive' } },
                { middlename: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ],
    },
  })
  return res
}
export async function findGroups({ search }: { search: string }) {
  return _findGroups.bind(null, search)()
}

export async function queryCreatedCourses(tutorId: number) {
  return db.course.findMany({
    where: {
      tutorId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      works: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
      groups: {
        select: {
          _count: { select: { students: true } },
          id: true,
        },
      },
      students: {
        select: {
          id: true,
        },
      },
    },
  })
}

export async function queryParticipatedCourses(studentId: number) {
  return db.course.findMany({
    where: {
      students: {
        some: {
          id: studentId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      addedToNotifications: {
        select: {
          id: true,
        },
      },
      tutor: {
        select: {
          id: true,
          name: true,
          middlename: true,
        },
      },
      works: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    },
  })
}
