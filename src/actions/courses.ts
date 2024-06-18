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

export async function createCourse(props: { tutorId: number; title: string; groupsIds: number[]; studentsIds: number[]; worksIds: number[] }) {
  const newCourse = await db.course.create({
    data: {
      title: props.title,
      // description JSON TIPTAP
      tutorId: props.tutorId,
      groups: {
        connect: props.groupsIds.map((id) => ({ id })),
      },
      works: {
        connect: props.worksIds.map((id) => ({ id })),
      },
      students: {
        connect: props.studentsIds.map((id) => ({ id })),
      },
      addedToNotifications: {
        createMany: {
          data: props.studentsIds.map((id) => ({
            receiverId: id,
            senderId: props.tutorId,
          })),
        },
      },
    },
  })
  return newCourse
}
