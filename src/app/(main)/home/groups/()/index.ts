import { db } from '#/prisma'
import { Merge } from '@/merge'

export type Group = Merge<Awaited<ReturnType<typeof queryCreatedGroups>>, Awaited<ReturnType<typeof queryParticipatedGroups>>>[number]

export async function queryCreatedGroups(tutorId: number) {
  return db.group.findMany({
    where: {
      tutorId,
    },
    include: {
      _count: true,
    },
  })
}

export async function queryParticipatedGroups(studentId: number) {
  return db.group.findMany({
    where: {
      students: {
        some: {
          id: studentId,
        },
      },
    },
  })
}
