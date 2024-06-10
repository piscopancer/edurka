import { db } from '#/prisma'
import { Merge } from '@/merge'
import { User } from '@prisma/client'

export type Group = Merge<
  Awaited<ReturnType<typeof queryCreatedGroups>>,
  Awaited<ReturnType<typeof queryParticipatedGroups>>
>[number]

export async function queryCreatedGroups(authUser: User) {
  return db.group.findMany({
    where: {
      tutorId: authUser.id,
    },
    include: {
      _count: true,
    },
  })
}

export async function queryParticipatedGroups(authUser: User) {
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
