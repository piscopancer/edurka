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
    select: { ...sharedSelect, _count: { select: { participatedCourses: true } } },
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

export async function queryStudents(tutorId: number, search: string) {
  return db.user.findMany({
    where: {
      NOT: {
        id: tutorId,
      },
      OR: [{ name: { contains: search, mode: 'insensitive' } }, { surname: { contains: search, mode: 'insensitive' } }, { middlename: { contains: search, mode: 'insensitive' } }],
    },
    select: {
      id: true,
      name: true,
      surname: true,
      middlename: true,
      _count: {
        select: {
          participatedGroups: { where: { tutorId } },
          participatedCourses: { where: { tutorId } },
        },
      },
    },
  })
}

export async function addStudent({ groupId, studentId }: { groupId: number; studentId: number }) {
  const group = await db.group.update({
    where: {
      id: groupId,
    },
    data: {
      students: {
        connect: {
          id: studentId,
        },
      },
    },
  })
  return group
}

export async function excludeStudent({ groupId, studentId }: { groupId: number; studentId: number }) {
  const group = await db.group.update({
    where: {
      id: groupId,
    },
    data: {
      students: {
        disconnect: {
          id: studentId,
        },
      },
    },
  })
  return group
}

export async function deleteGroup({ groupId }: { groupId: number }) {
  const group = await db.group.delete({
    where: {
      id: groupId,
    },
  })
  return group
}

export async function createGroup({ tutorId, title, studentsIds }: { tutorId: number; title: string; studentsIds: number[] }) {
  const group = await db.group.create({
    data: {
      title,
      tutorId,
      students: {
        connect: studentsIds.map((id) => ({ id })),
      },
    },
    select: { ...sharedSelect },
  })
  return group
}
