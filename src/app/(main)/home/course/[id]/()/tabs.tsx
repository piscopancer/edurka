'use client'

import Work from '@/components/work'
import useUrl from '@/hooks/use-url'
import { useTutorMode } from '@/query/hooks'
import { route } from '@/utils'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { coursePageUrlSchema, Tab, useCourseQuery } from '.'
import Description from './description'

const tabs = [
  { id: 'description', title: 'Description' },
  { id: 'works', title: 'Works' },
  { id: 'settings', title: 'Settings' },
] satisfies { id: Tab; title: string }[]

export default function Tabs({ courseId, ...props }: { courseId: number } & ComponentProps<'div'>) {
  const url = useUrl(route(`/home/course/${courseId}`), coursePageUrlSchema)
  const { data: tutorMode } = useTutorMode()
  const { data: course } = useCourseQuery(courseId)

  if (!course) return

  return (
    <div {...props}>
      <menu className='mb-8 flex border-b px-6'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              url.sp.write('tab', tab.id)
            }}
            className={clsx(
              (url.sp.get('tab') === undefined && tab.id === 'description') || url.sp.get('tab') === tab.id ? 'bg-zinc-200' : 'border-transparent',
              'translate-y-px rounded-t-lg border-x border-t px-4 py-1',
            )}
          >
            {tab.title}
          </button>
        ))}
      </menu>
      {(url.sp.get('tab') === undefined || url.sp.get('tab') === 'description') && <Description courseId={courseId} className='px-6' />}
      {url.sp.get('tab') === 'works' && (
        <ul className='grid grid-cols-2 gap-6 px-6'>
          {course.works.map((work) => (
            <li key={work.id}>
              <Work tutorMode={!!tutorMode} work={work} />
            </li>
          ))}
        </ul>
      )}
      {url.sp.get('tab') === 'settings' && (
        <div className='mx-6 grid grid-cols-[1fr,2fr] gap-x-16'>
          <nav>
            <button className='w-full rounded-lg border px-6 py-1 text-lg'>Security</button>
          </nav>
          <div>
            <article className='rounded-lg border shadow'>
              <header className='mb-1 px-4 pt-4 text-xl'>
                <h2>Delete Course</h2>
              </header>
              <p className='mb-4 px-4 text-sm'>An irrevocable action. Course will be unable to restore. Attached works, groups and students will remain. Proceed with caution</p>
              <footer className='flex justify-end border-t px-4 py-3'>
                <button className='rounded-lg bg-zinc-900 px-6 py-2 text-zinc-200 hover:bg-zinc-800'>Delete</button>
              </footer>
            </article>
          </div>
        </div>
      )}
    </div>
  )
}
