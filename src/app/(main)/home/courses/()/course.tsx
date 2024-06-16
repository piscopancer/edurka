'use client'

import { Tooltip } from '@/components/tooltip'
import { formatDate } from '@/utils'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { type Course } from '.'

export default function Course({ course, ...props }: ComponentProps<'article'> & { course: Course }) {
  return (
    <article {...props} className={clsx(props.className, 'rounded-lg border shadow @container')}>
      <nav className='flex'>
        <button>Course</button>
        <button>Completion</button>
      </nav>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <ul className='flex flex-wrap gap-1'>
        {course.works.map((work) => (
          <li key={work.id}>
            <Tooltip
              content={
                <article className='p-2'>
                  <h1>{work.title}</h1>
                  <p>{formatDate(work.createdAt as Date)}</p>
                </article>
              }
            >
              <button onClick={() => console.log(work.id)} className='size-4 rounded-md border'></button>
            </Tooltip>
          </li>
        ))}
      </ul>
    </article>
  )
}
