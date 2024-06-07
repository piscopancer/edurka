'use server'

import { db } from '#/prisma'
import { Prisma } from '@prisma/client'

async function _createCourse(course: Prisma.CourseCreateArgs) {
  const newCourse = await db.course.create(course)
  return newCourse
}

export async function createCourse(course: Prisma.CourseCreateArgs) {
  return _createCourse.bind(null, course)()
}
