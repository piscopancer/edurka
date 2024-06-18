'use server'

import { db } from '#/prisma'
import { z } from 'zod'
import { CoursesPageFilters, coursesPageUrlSchema, defaultOrder } from '.'

export async function findWorks(search: string) {
  return db.work.findMany({
    where: {
      OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
    },
    select: { id: true, title: true, createdAt: true },
  })
}

export async function findParticipants(search: string) {
  const participants = await db.$transaction(async (tx) => {
    const groups = await tx.group.findMany({
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
                ],
              },
            },
          },
        ],
      },
      take: 20,
    })
    const students = await tx.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { surname: { contains: search, mode: 'insensitive' } },
          { middlename: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        surname: true,
        middlename: true,
      },
      take: 20,
    })
    return { groups, students }
  })
  return participants
}

export async function queryCreatedCourses(tutorId: number, filters: z.infer<typeof coursesPageUrlSchema>['searchParams']) {
  return db.course.findMany({
    where: {
      tutorId,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
              { description: { contains: filters.search, mode: 'insensitive' } },
              {
                groups: {
                  some: { title: { contains: filters.search, mode: 'insensitive' } },
                },
              },
              {
                students: {
                  some: {
                    OR: [
                      { name: { contains: filters.search, mode: 'insensitive' } },
                      { surname: { contains: filters.search, mode: 'insensitive' } },
                      { middlename: { contains: filters.search, mode: 'insensitive' } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      ...(filters.sorting === 'createdAt' ? { createdAt: filters.order ?? defaultOrder } : {}),
      ...(filters.sorting === 'students' ? { students: { _count: filters.order ?? defaultOrder } } : {}),
      ...(filters.sorting === 'works' ? { works: { _count: filters.order ?? defaultOrder } } : {}),
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

export async function queryParticipatedCourses(studentId: number, filters: CoursesPageFilters) {
  return db.course.findMany({
    where: {
      students: {
        some: {
          id: studentId,
        },
      },
      ...(filters.search
        ? {
            OR: [{ title: { contains: filters.search, mode: 'insensitive' } }, { description: { contains: filters.search, mode: 'insensitive' } }],
          }
        : {}),
    },
    orderBy: {
      ...(filters.sorting === 'createdAt' ? { createdAt: filters.order ?? defaultOrder } : {}),
      ...(filters.sorting === 'works' ? { works: { _count: filters.order ?? defaultOrder } } : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
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
