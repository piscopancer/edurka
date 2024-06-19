'use client'

import { useTutorMode } from '@/query/hooks'
import { formatDate } from '@/utils'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { type Group } from '.'
import { useCreatedGroups, useParticipatedGroups } from './hooks'

export default function Groups() {
  const { data: tutorMode } = useTutorMode()
  const { data: createdGroups } = useCreatedGroups()
  const { data: participatedGroups } = useParticipatedGroups()

  return (
    <>
      {[tutorMode ? createdGroups : participatedGroups].length > 0 ? (
        <ul className='grid grid-cols-4'>
          {((tutorMode ? createdGroups : participatedGroups) ?? []).map((group) => (
            <li key={group.id}>
              <Group group={group} />
            </li>
          ))}
        </ul>
      ) : (
        <div>no groups</div>
      )}
    </>
  )
}

export function Group({ group, ...props }: ComponentProps<'article'> & { group: Group }) {
  return (
    <article {...props} className={clsx(props.className, 'rounded-md border-2 border-zinc-300 px-4 py-2')}>
      <time className='text-sm'>{formatDate(group.createdAt as Date)}</time>
      <h1 className='text-xl'>{group.title}</h1>
      {group._count && <p>{group._count.students}</p>}
    </article>
  )
}
