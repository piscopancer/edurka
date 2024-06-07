'use client'

import { createCourse } from '@/actions/courses'
import { Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { ComponentProps, useId, useRef, useState } from 'react'
import { searchStudents } from './actions'

export default function CourseCreator({ tutorId, ...props }: ComponentProps<'article'> & Pick<Course, 'tutorId'>) {
  const createCourseMutation = useMutation({ mutationFn: createCourse })
  const titleInputRef = useRef<HTMLInputElement>(null!)
  const titleId = useId()
  const searchStudentsId = useId()
  const searchStudentsMutation = useMutation({ mutationFn: searchStudents })
  type Student = NonNullable<(typeof searchStudentsMutation)['data']>[number]
  const [foundStudents, setFoundStudents] = useState<Student[]>([])
  const [studentsToInclude, setStudentsToInclude] = useState<Student[]>([])

  return (
    <article {...props} className={clsx(props.className, '')}>
      <fieldset>
        <label htmlFor={titleId} className='mb-1 text-sm'>
          Title
        </label>
        <input id={titleId} ref={titleInputRef} type='text' className='rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      {/*  */}
      <fieldset>
        <label htmlFor={searchStudentsId} className='mb-1 text-sm'>
          Search students (name, surname, middlename or email)
        </label>
        <input
          id={searchStudentsId}
          ref={titleInputRef}
          onChange={async (e) => {
            const foundStudents = await searchStudentsMutation.mutateAsync({
              tutorId,
              search: e.target.value.trim(),
            })
            setFoundStudents(foundStudents)
          }}
          type='text'
          className='rounded-md bg-zinc-300 px-3 py-2'
        />
      </fieldset>
      <ul>
        {foundStudents.map((student) => (
          <li key={student.id}>
            <span>
              {student.name} {student.surname}
            </span>{' '}
            <span>{student.participatedCourses.length}</span>
            <button
              onClick={() => {
                setStudentsToInclude((prev) => [...prev, student])
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>
      {/*  */}
      <button
        onClick={async () => {
          await createCourseMutation.mutateAsync({
            data: {
              title: titleInputRef.current.value.trim(),
              tutorId,
              // students: {
              // connect: {
              // id:
              // },
              // },
            },
          })
        }}
      >
        Create Course
      </button>
    </article>
  )
}
