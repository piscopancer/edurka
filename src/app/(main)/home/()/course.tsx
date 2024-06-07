'use client'

import { AuthUser } from '@/auth'
import { type Course } from '@prisma/client'
import clsx from 'clsx'
import { ComponentProps } from 'react'

export default function Course({
  authUser,
  course,
  ...props
}: ComponentProps<'article'> & { authUser: AuthUser; course: Course }) {
  return (
    <article {...props} className={clsx(props.className, '')}>
      <span>{course.id}</span>
      <h2>{course.title}</h2>
      <p>{course.tutorId}</p>
      {/* <p>{course.createdAt}</p> */}
    </article>
  )
}
