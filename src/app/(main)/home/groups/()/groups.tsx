'use client'

import Dialog from '@/components/dialog'
import Search from '@/components/search'
import { useAuthUser, useTutorMode } from '@/query/hooks'
import { formatDate } from '@/utils'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { type Group } from '.'
import { useCreatedGroups, useParticipatedGroups } from './hooks'
import { groupStore, tabs } from './store'

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

function Group({ group, ...props }: ComponentProps<'article'> & { group: Group }) {
  const { data: authUser } = useAuthUser()
  const [open, setOpen] = useState(false)
  const groupSnap = useSnapshot(groupStore)

  return (
    <article {...props} className={clsx(props.className, 'rounded-xl border px-4 py-2 shadow')}>
      <time className='text-xs'>{formatDate(group.createdAt as Date)}</time>
      <h1 className='mb-2 text-xl'>{group.title}</h1>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={({ Trigger }) => <Trigger className='rounded-md border px-2 text-sm'>{group.students.length} student(-s)</Trigger>}
        Content={({ Trigger }) => (
          <>
            <Trigger className='ml-auto'>
              <TbX className='size-16 p-4' />
            </Trigger>
            <h3 className='mb-4 px-4 text-sm'>Group: {group.title}</h3>
            <menu className='mb-4 flex border-b px-4'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  disabled={groupSnap.tab === tab.id}
                  onClick={() => (groupStore.tab = tab.id)}
                  className={clsx(groupSnap.tab === tab.id ? 'bg-zinc-200' : 'border-transparent', 'translate-y-px rounded-t-lg border-x border-t px-4 py-1')}
                >
                  {tab.title}
                </button>
              ))}
            </menu>
            {groupSnap.tab === 'all-students' && (
              <ul className='grid grid-cols-[auto,1fr,auto]'>
                {group.students.map((student, i) => {
                  const isAuthUser = !!(authUser && authUser.id === student.id)
                  return (
                    <li key={student.id} className='col-span-full grid grid-cols-subgrid border-b border-dashed first:border-t'>
                      <span className='border-r border-dashed px-4 py-2'>{i + 1}</span>
                      <span className='line-clamp-1 border-r border-dashed px-4 py-2'>
                        {student.surname} {student.name} {student.middlename}
                        {isAuthUser && <span className='rounded-md border px-1.5 align-middle text-sm'>You</span>}
                      </span>
                      <button disabled={isAuthUser} className='px-4 text-sm disabled:bg-halftone enabled:hover:bg-zinc-800 enabled:hover:text-zinc-200'>
                        Kick
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            {groupSnap.tab === 'add-a-student' && (
              <div className='px-4'>
                <Search change={() => {}} clear={() => {}} />
              </div>
            )}
          </>
        )}
      />
    </article>
  )
}
