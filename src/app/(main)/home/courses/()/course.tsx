'use client'

import { Tooltip } from '@/components/tooltip'
import { formatDate } from '@/utils'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbExternalLink, TbPlus } from 'react-icons/tb'
import { type Course } from '.'

export default function Course({ course, tutorMode, ...props }: ComponentProps<'article'> & { tutorMode: boolean; course: Course }) {
  return (
    <article {...props} className={clsx(props.className, 'rounded-xl border shadow @container')}>
      <h2 className='mx-4 mb-1 mt-4 text-xl'>{course.title}</h2>
      {/* description will be tiptap */}
      {course.description && <p className='mx-4 mb-3 text-sm'>{course.description.toString()}</p>}
      {tutorMode && (
        <nav className='flex border-b border-dashed px-4 pb-2 text-sm'>
          <button className='rounded-lg border px-3 py-0.5'>Works</button>
          <button className='rounded-lg border border-transparent px-3 py-0.5'>Completion</button>
        </nav>
      )}
      <ul className='flex flex-wrap gap-1 border-b border-dashed px-4 py-2'>
        {course.works.map((work) => (
          <li key={work.id}>
            <Tooltip
              delay={0}
              content={
                <article className='grid grid-cols-[1fr,auto] gap-x-2 py-1 pl-1'>
                  <h1 className='mb-1'>{work.title}</h1>
                  <TbExternalLink className='row-span-2 size-4' />
                  <p className='text-xs'>{formatDate(work.createdAt as Date)}</p>
                  {/* additional info if expires, also show sandclock */}
                </article>
              }
            >
              <button onClick={() => console.log(work.id)} className='flex size-6 rounded-md border'></button>
            </Tooltip>
          </li>
        ))}
        {tutorMode && (
          <li>
            <Tooltip content='Add or create a new work'>
              <button className='flex size-6 items-center justify-center rounded-md border'>
                <TbPlus />
              </button>
            </Tooltip>
          </li>
        )}
      </ul>
      <div className='bg-halftone px-4 py-0.5 text-sm'>{formatDate(course.createdAt as Date)}</div>
    </article>
  )
}
