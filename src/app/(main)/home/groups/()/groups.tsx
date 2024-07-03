'use client'

import { useTutorMode } from '@/query/hooks'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbUsersGroup } from 'react-icons/tb'
import Group from './group'
import { useCreatedGroups, useParticipatedGroups } from './query'

export default function Groups(props: ComponentProps<'div'>) {
  const { data: tutorMode } = useTutorMode()
  const { data: createdGroups } = useCreatedGroups()
  const { data: participatedGroups } = useParticipatedGroups()

  return (
    <div {...props} className={clsx(props.className, '')}>
      {(tutorMode ? createdGroups : participatedGroups)?.length ? (
        <ul className='grid grid-cols-2 gap-4'>
          {((tutorMode ? createdGroups : participatedGroups) ?? []).map((group) => (
            <li key={group.id}>
              <Group group={group} />
            </li>
          ))}
        </ul>
      ) : (
        <div className='mt-12 text-center'>
          <TbUsersGroup className='mb-6 inline-block size-20 rounded-lg border border-accent bg-accent bg-accent/10 stroke-accent p-4 shadow shadow-accent/20' />
          <h2 className=''>You do not have groups yet</h2>
        </div>
      )}
    </div>
  )
}
