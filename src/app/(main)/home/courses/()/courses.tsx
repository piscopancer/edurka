'use client'

import { useAuthUser } from '@/query/hooks'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import Course from './course'
import { useCreatedCourses, useParticipatedCourses } from './hooks'

export default function Courses({ tutorMode, ...props }: ComponentProps<'ul'> & { tutorMode: boolean }) {
  const authUser = useAuthUser()
  const createdCoursesQuery = useCreatedCourses(authUser.data?.id)
  const participatedCoursesQuery = useParticipatedCourses(authUser.data?.id)

  return (
    <ul {...props} className={clsx(props.className, 'flex flex-col gap-2')}>
      {((tutorMode ? createdCoursesQuery.data : participatedCoursesQuery.data) ?? []).map((course) => (
        <li key={course.id}>
          <Course course={course} />
        </li>
      ))}
    </ul>
  )
}
