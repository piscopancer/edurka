'use server'

import { db } from '#/prisma'
import { GroupsPageFilter } from '.'

export async function queryCreatedGroups(tutorId: number, filter: GroupsPageFilter) {
  return db.group.findMany({
    where: {
      tutorId,
      ...(filter.search
        ? {
            OR: [{ title: { contains: filter.search, mode: 'insensitive' } }],
          }
        : {}),
    },
    include: {
      _count: true,
    },
  })
}

export async function queryParticipatedGroups(studentId: number, filter: GroupsPageFilter) {
  return db.group.findMany({
    where: {
      students: {
        some: {
          id: studentId,
        },
      },
      ...(filter.search
        ? {
            OR: [{ title: { contains: filter.search, mode: 'insensitive' } }],
          }
        : {}),
    },
  })
}
