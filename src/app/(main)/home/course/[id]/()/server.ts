'use server'

import { db } from '#/prisma'
import { Prisma } from '@prisma/client'

const studentsSelection: Prisma.UserSelect = {
  id: true,
  name: true,
  surname: true,
  middlename: true,
}

export async function queryCourse(id: number) {
  return db.course.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      works: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      groups: {
        select: {
          students: { select: studentsSelection },
        },
      },
      students: {
        select: studentsSelection,
      },
      tutor: {
        select: {
          id: true,
          name: true,
          surname: true,
          middlename: true,
        },
      },
    },
  })
}

type UpdateCourseData = Partial<{
  title: string
  description: string
  worksToDisconnectIds: number[]
  worksToConnectIds: number[]
}>

export async function updateCourse({ id, ...updateData }: { id: number } & UpdateCourseData) {
  const course = await db.course.update({
    where: {
      id,
    },
    data: {
      ...(updateData.title ? { title: updateData.title } : {}),
      ...(updateData.description ? { description: updateData.description } : {}),
      ...(updateData.worksToDisconnectIds
        ? {
            works: {
              disconnect: updateData.worksToDisconnectIds.map((id) => ({ id })),
            },
          }
        : {}),
      ...(updateData.worksToConnectIds
        ? {
            works: {
              connect: updateData.worksToConnectIds.map((id) => ({ id })),
            },
          }
        : {}),
    },
  })
  return course
}
