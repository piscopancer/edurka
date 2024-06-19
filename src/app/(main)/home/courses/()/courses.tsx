'use client'

import { useTutorMode } from '@/query/hooks'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import Course from './course'
import { useCreatedCourses, useParticipatedCourses } from './hooks'

export default function Courses({ ...props }: ComponentProps<'ul'>) {
  const { data: tutorMode } = useTutorMode()
  const createdCoursesQuery = useCreatedCourses()
  const participatedCoursesQuery = useParticipatedCourses()

  return (
    <ul {...props} className={clsx(props.className, 'flex flex-col gap-4')}>
      {((tutorMode ? createdCoursesQuery.data : participatedCoursesQuery.data) ?? []).map((course) => (
        <li key={course.id}>
          <Course course={course} tutorMode={!!tutorMode} />
        </li>
      ))}
    </ul>
  )
}
