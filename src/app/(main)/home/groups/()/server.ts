'use server'

import { db } from '#/prisma'
import { Prisma } from '@prisma/client'
import { GroupsPageFilter } from '.'

const sharedSelect = {
  id: true,
  title: true,
  createdAt: true,
  students: {
    select: {
      id: true,
      name: true,
      surname: true,
      middlename: true,
    },
  },
} satisfies Prisma.GroupSelect

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
    select: { ...sharedSelect },
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
    select: { ...sharedSelect },
  })
}
