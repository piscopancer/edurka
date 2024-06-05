'use client'

import { AuthUser } from '@/auth'
import { SelectCourse } from '@/db/schema/courses'
import clsx from 'clsx'
import { ComponentProps } from 'react'

export default function Course({
  authUser,
  course,
  ...props
}: ComponentProps<'article'> & { authUser: AuthUser } & { course: SelectCourse }) {
  return (
    <article {...props} className={clsx(props.className, '')}>
      <span>{course.id}</span>
      <h2>{course.name}</h2>
      <p>{course.tutorId}</p>
      {/* <p>{course.createdAt}</p> */}
    </article>
  )
}
