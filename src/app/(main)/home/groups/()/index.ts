import { db } from '#/prisma'
import { AuthUser } from '@/auth'
import { Merge } from '@/merge'

export type Group = Merge<Awaited<ReturnType<typeof queryCreatedGroups>>, Awaited<ReturnType<typeof queryParticipatedGroups>>>[number]

export async function queryCreatedGroups(authUser: AuthUser) {
  return db.group.findMany({
    where: {
      tutorId: authUser.id,
    },
    include: {
      _count: true,
    },
  })
}

export async function queryParticipatedGroups(authUser: AuthUser) {
  return db.group.findMany({
    where: {
      students: {
        some: {
          id: authUser.id,
        },
      },
    },
  })
}
