'use client'

import * as Dialog from '@/components/dialog'
import Search from '@/components/search'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuthUser, useTutorMode } from '@/query/hooks'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { TbPlus, TbUsersGroup, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { useCreateGroupMutation, useStudents } from './query'
import { groupCreatorStore } from './store'

export default function GroupCreator() {
  const groupCreatorSnap = useSnapshot(groupCreatorStore)
  const { data: authUser } = useAuthUser()
  const { data: tutorMode } = useTutorMode()
  const studentsQuery = useStudents(groupCreatorSnap.studentsSearch.trim())
  const debouncedSearch = useDebounce({
    callback(search: string) {
      groupCreatorStore.studentsSearch = search
    },
    seconds: 0.7,
  })
  const createGroupMutation = useCreateGroupMutation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    studentsQuery.refetch()
  }, [groupCreatorSnap.studentsSearch])

  if (!authUser || !tutorMode) return null

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className='rounded-lg bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New group</Dialog.Trigger>
      <>
        <header className='flex items-center border-b pl-4'>
          <h2 className='text-lg'>Create a new group</h2>
          <Dialog.Trigger className='ml-auto block'>
            <TbX className='size-16 p-4' />
          </Dialog.Trigger>
        </header>
        <section className='grid grow grid-cols-[20%,1fr] overflow-y-auto border-b'>
          <div className='h-full border-r border-dashed'>
            <div className='flex aspect-square items-center justify-center border-b border-dashed'>
              <TbUsersGroup className='size-8' />
            </div>
          </div>
          <div className='mt-8'>
            <fieldset className='mb-4 px-8'>
              <label htmlFor='title' className='mb-1 block text-lg font-medium'>
                Title
              </label>
              <input
                id='title'
                type='text'
                autoComplete='off'
                defaultValue={groupCreatorSnap.title}
                onChange={(e) => (groupCreatorStore.title = e.target.value)}
                className='w-full rounded-lg border px-4 py-2 shadow'
              />
            </fieldset>
            <fieldset className='mb-4 px-8'>
              <label htmlFor='search' className='mb-1 block text-lg font-medium'>
                Students
              </label>
              <Search
                id='search'
                loading={studentsQuery.isFetching}
                defaultValue={groupCreatorSnap.studentsSearch}
                clear={() => {
                  debouncedSearch.cancel()
                  groupCreatorStore.studentsSearch = ''
                }}
                change={debouncedSearch.call}
              />
            </fieldset>
            <p className='mb-4 px-8 text-sm'>Found: {studentsQuery.data?.length ?? 0}</p>
            {studentsQuery.data && (
              <ul className='grid grid-cols-[auto,1fr,auto]'>
                {studentsQuery.data.map((student, i) => {
                  const included = groupCreatorSnap.studentsIds.some((id) => id === student.id)
                  return (
                    <li key={student.id} className='col-span-full grid grid-cols-subgrid border-b border-dashed first:border-t'>
                      <span className='border-r border-dashed px-4 py-2 text-center'>{i + 1}</span>
                      <span className='border-r border-dashed px-4 py-2'>
                        {student.surname} {student.name} {student.middlename}
                      </span>
                      <button
                        onClick={() => {
                          if (!included) {
                            groupCreatorStore.studentsIds.push(student.id)
                          } else {
                            groupCreatorStore.studentsIds = groupCreatorStore.studentsIds.filter((id) => id !== student.id)
                          }
                        }}
                        className={clsx('px-4 py-2', included ? 'bg-accent/10 text-accent-dark' : '')}
                      >
                        <TbPlus className={clsx('size-5 duration-200', included && 'rotate-45')} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
        <footer className='flex justify-end p-4'>
          <button
            disabled={createGroupMutation.isPending || !groupCreatorStore.studentsIds.length || !groupCreatorStore.title.trim()}
            onClick={async () => {
              await createGroupMutation.mutateAsync({
                title: groupCreatorStore.title,
                studentsIds: groupCreatorStore.studentsIds,
                tutorId: authUser.id,
              })
              setOpen(false)
            }}
            className='rounded-lg border bg-zinc-900 px-4 py-2 disabled:bg-halftone enabled:text-zinc-200 enabled:hover:bg-zinc-800'
          >
            Create
          </button>
        </footer>
      </>
    </Dialog.Root>
  )
}
