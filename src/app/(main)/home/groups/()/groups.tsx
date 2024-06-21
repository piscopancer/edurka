'use client'

import { useTutorMode } from '@/query/hooks'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import Group from './group'
import { useCreatedGroups, useParticipatedGroups } from './hooks'

export default function Groups(props: ComponentProps<'div'>) {
  const { data: tutorMode } = useTutorMode()
  const { data: createdGroups } = useCreatedGroups()
  const { data: participatedGroups } = useParticipatedGroups()

  return (
    <div {...props} className={clsx(props.className, '')}>
      {(tutorMode ? createdGroups : participatedGroups)?.length ? (
        <ul className='grid grid-cols-2'>
          {((tutorMode ? createdGroups : participatedGroups) ?? []).map((group) => (
            <li key={group.id}>
              <Group group={group} />
            </li>
          ))}
        </ul>
      ) : (
        <div>no groups</div>
      )}
    </div>
  )
}
