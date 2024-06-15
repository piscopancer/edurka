'use server'

import { db } from '#/prisma'

db.course.create({
  data: {
    title: 'New course',
    tutor: {
      connect: {
        id: 1,
      },
    },
  },
})

async function _createCourse(course: Awaited<Parameters<typeof db.course.create>[0]>) {
  const newCourse = await db.course.create(course)
  return newCourse
}

export async function createCourse(course: Awaited<Parameters<typeof db.course.create>[0]>) {
  return _createCourse.bind(null, course)()
}
