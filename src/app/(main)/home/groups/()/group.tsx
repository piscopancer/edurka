'use client'

import * as Dialog from '@/components/dialog'
import Search from '@/components/search'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuthUser, useTutorMode } from '@/query/hooks'
import { formatDate } from '@/utils'
import * as Popover from '@radix-ui/react-popover'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { TbDotsVertical, TbLoader, TbTrash, TbUsersGroup, TbUsersPlus, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { type Group } from '.'
import { useAddStudentMutation, useDeleteGroupMutation, useExcludeStudentMutation } from './query'
import { queryStudents } from './server'
import { groupStore, tabs } from './store'

export default function Group({ group, ...props }: ComponentProps<'article'> & { group: Group }) {
  const { data: authUser } = useAuthUser()
  const { data: tutorMode } = useTutorMode()
  const groupSnap = useSnapshot(groupStore)
  const queryStudentsQuery = useQuery({
    queryKey: ['query-students', authUser?.id, groupSnap.search],
    queryFn: async () => (authUser && groupSnap.search ? await queryStudents(authUser.id, groupSnap.search.trim()) : []),
    enabled: !!(authUser && groupSnap.search.trim()),
  })
  const searchDebouncer = useDebounce({
    callback(search: string) {
      groupStore.search = search
    },
    seconds: 0.7,
  })
  const [showMore, setShowMore] = useState(false)
  const deleteGroupMutation = useDeleteGroupMutation(group.id)
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false)
  const [confirmGroupTitle, setConfirmGroupTitle] = useState('')

  return (
    <article {...props} className={clsx(props.className, 'grid grid-cols-[1fr,auto] rounded-xl border pl-4 shadow')}>
      <time className='mt-2 text-xs'>{formatDate(group.createdAt as Date)}</time>
      <h1 className='mb-2 mt-1 text-xl'>{group.title}</h1>
      <Dialog.Root>
        <Dialog.Trigger className='mb-2 w-fit rounded-md border px-2 text-sm'>{group.students.length} student(-s)</Dialog.Trigger>
        <>
          <Dialog.Trigger className='ml-auto'>
            <TbX className='size-16 p-4' />
          </Dialog.Trigger>
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
          {groupSnap.tab === 'all-students' &&
            (group.students.length ? (
              <ul className='grid grid-cols-[auto,1fr,auto]'>
                {group.students.map((student, i) => (
                  <li key={student.id} className='col-span-full grid grid-cols-subgrid border-b border-dashed first:border-t'>
                    <ParticipatingStudent group={group} student={student} i={i} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='mt-12 text-center'>
                <TbUsersPlus className='mb-4 size-16 rounded-lg border border-accent bg-accent/10 stroke-accent p-4 shadow shadow-accent/20' />
                <p className='mb-4'>There are no students in this group</p>
                <button onClick={() => (groupStore.tab = 'add-students')} className='rounded-lg bg-zinc-900 px-4 py-2 text-zinc-200 hover:bg-zinc-800'>
                  Add students
                </button>
              </div>
            ))}
          {groupSnap.tab === 'add-students' && (
            <div>
              <div className='px-4'>
                <Search
                  autoFocus
                  defaultValue={groupSnap.search}
                  change={(value) => {
                    if (value.trim()) {
                      searchDebouncer.call(value)
                    } else {
                      searchDebouncer.cancel()
                      groupStore.search = ''
                    }
                  }}
                  clear={() => {
                    searchDebouncer.cancel()
                    groupStore.search = ''
                  }}
                  loading={queryStudentsQuery.isFetching}
                  className='mb-6'
                />
              </div>
              {queryStudentsQuery.data?.length ? (
                <ul className='grid grid-cols-[auto,1fr,auto]'>
                  {queryStudentsQuery.data.map((student, i) => (
                    <li key={student.id} className='col-span-full grid grid-cols-subgrid border-b border-dashed first:border-t'>
                      <StudentToAdd group={group} student={student} i={i} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </>
      </Dialog.Root>
      <Popover.Root open={showMore} onOpenChange={setShowMore}>
        <Popover.Trigger className='col-start-2 row-span-3 row-start-1 flex px-2 pt-3'>
          <TbDotsVertical className='size-5' />
        </Popover.Trigger>
        <Popover.Content side='top' align='end' className='w-64 rounded-lg border bg-zinc-200 py-2 shadow'>
          <menu>
            {tutorMode && (
              <button
                onClick={() => {
                  setShowMore(false)
                  setShowConfirmDeletion(true)
                }}
                className='flex w-full items-center border-y border-transparent px-4 py-2 hover:border-inherit'
              >
                <span className='mr-auto'>Delete</span>
                <TbTrash />
              </button>
            )}
          </menu>
          <Popover.Arrow className='w-3' />
        </Popover.Content>
      </Popover.Root>
      <Dialog.Root open={showConfirmDeletion} onOpenChange={setShowConfirmDeletion} contentProps={{ size: 'sm' }}>
        <></>
        <>
          <header className='mb-6 flex items-center border-b pl-4'>
            <h2 className='mr-auto'>Confirm deletion</h2>
            <Dialog.Trigger>
              <TbX className='size-10 p-2.5' />
            </Dialog.Trigger>
          </header>
          <div className='border-b pb-6 text-center'>
            <TbUsersGroup className='mb-4 size-20 rounded-xl border border-accent bg-accent/10 stroke-accent p-4 shadow shadow-accent/20' />
            <p className='mb-1 text-xl'>{group.title}</p>
            <div className='flex items-center justify-center text-sm'>
              <span>
                <span className='rounded-md border px-1.5'>{group.students.length}</span> students in{' '}
                <span className='rounded-md border px-1.5'>{group._count?.participatedCourses ?? 0}</span> courses
              </span>
            </div>
          </div>
          <footer className='px-4 py-4'>
            <p className='mb-4 rounded-lg text-center text-sm text-accent-dark'>
              Upon deletion of the group, students will lose access to the current courses and works. Students' current attempts will be irrevocably removed
            </p>
            <fieldset className='mb-4'>
              <label htmlFor='confirm' className='mb-2 block text-center'>
                To confirm, type <span className='font-semibold'>{group.title}</span> in the input below
              </label>
              <input
                value={confirmGroupTitle}
                autoFocus
                autoComplete='off'
                id='confirm'
                type='text'
                onChange={(e) => setConfirmGroupTitle(e.target.value)}
                className='w-full rounded-lg border px-4 py-2'
              />
            </fieldset>
            <div className='flex w-full gap-2'>
              <button
                onClick={() => {
                  setShowConfirmDeletion(false)
                }}
                className='grow basis-0 rounded-lg border px-4 py-1'
              >
                Cancel
              </button>
              <button
                disabled={confirmGroupTitle.trim() !== group.title}
                onClick={() => {
                  setShowConfirmDeletion(false)
                  deleteGroupMutation.mutate({ groupId: group.id })
                }}
                className='grow basis-0 rounded-lg border bg-zinc-900 px-4 py-1 disabled:bg-halftone enabled:text-zinc-200 enabled:hover:bg-zinc-800'
              >
                Delete
              </button>
            </div>
          </footer>
        </>
      </Dialog.Root>
    </article>
  )
}

function ParticipatingStudent({ student, i, group }: { student: (typeof group)['students'][number]; group: Group; i: number }) {
  const { data: authUser } = useAuthUser()
  const [open, setOpen] = useState(false)
  const isAuthUser = !!(authUser && authUser.id === student.id)
  const excludeStudentMutation = useExcludeStudentMutation({ groupId: group.id, studentId: student.id })

  return (
    <>
      <span className='border-r border-dashed px-4 py-2'>{i + 1}</span>
      <span className='line-clamp-1 border-r border-dashed px-4 py-2'>
        {student.surname} {student.name} {student.middlename}
        {isAuthUser && <span className='rounded-md border px-1.5 align-middle text-sm'>You</span>}
      </span>
      <Dialog.Root open={open} onOpenChange={setOpen} contentProps={{ size: 'sm' }}>
        <Dialog.Trigger disabled={isAuthUser} className='px-4 text-sm disabled:bg-halftone'>
          Exclude
        </Dialog.Trigger>
        <article>
          <header className='mb-4 flex items-center border-b pl-4'>
            <h2>Confirmation</h2>
            <Dialog.Trigger className='ml-auto block'>
              <TbX className='size-10 p-2.5' />
            </Dialog.Trigger>
          </header>
          <p className='mb-4 px-4 text-center'>
            You are about to exclude{' '}
            <span className='font-semibold'>
              {student.surname} {student.name} {student.middlename}
            </span>{' '}
            from the group <span className='font-semibold'>{group.title}</span>. The user will lose access to the courses in which this group is currently participating. User's
            submitted attempts will be irrevocably deleted too
          </p>
          <footer className='flex gap-x-2 border-t px-4 py-3'>
            <Dialog.Trigger className='flex h-8 grow basis-0 items-center justify-center rounded-lg border'>Cancel</Dialog.Trigger>
            <button
              disabled={excludeStudentMutation.isPending}
              onClick={() => {
                setOpen(false)
                excludeStudentMutation.mutate({
                  groupId: group.id,
                  studentId: student.id,
                })
              }}
              className={clsx('bg-halftone flex h-8 grow basis-0 items-center justify-center rounded-lg border bg-zinc-900 text-zinc-200 hover:bg-zinc-800')}
            >
              {excludeStudentMutation.isPending ? <TbLoader className='size-5 animate-spin' /> : 'Continue'}
            </button>
          </footer>
        </article>
      </Dialog.Root>
    </>
  )
}

function StudentToAdd({ student, i, group }: { student: Awaited<ReturnType<typeof queryStudents>>[number]; group: Group; i: number }) {
  const isParticipant = group.students.some((s) => s.id === student.id)
  const [open, setOpen] = useState(false)
  const addStudentMutation = useAddStudentMutation({ groupId: group.id, student })

  return (
    <>
      <span className='border-r border-dashed px-4 py-2'>{i + 1}</span>
      <span className='line-clamp-1 border-r border-dashed px-4 py-2'>
        {student.surname} {student.name} {student.middlename}
      </span>
      <Dialog.Root open={open} onOpenChange={setOpen} contentProps={{ size: 'sm' }}>
        <Dialog.Trigger disabled={isParticipant} className='px-4 text-sm disabled:bg-halftone'>
          Add
        </Dialog.Trigger>
        <article>
          <header className='mb-4 flex items-center border-b pl-4'>
            <h2>Confirmation</h2>
            <Dialog.Trigger className='ml-auto block'>
              <TbX className='size-10 p-2.5' />
            </Dialog.Trigger>
          </header>
          <p className='mb-4 px-4 text-center'>
            You are about to add{' '}
            <span className='font-semibold'>
              {student.surname} {student.name} {student.middlename}
            </span>{' '}
            to the group <span className='font-semibold'>{group.title}</span>. They will be granted access to the courses in which this group participates
          </p>
          <footer className='flex gap-x-2 border-t px-4 py-3'>
            <Dialog.Trigger className='flex h-8 grow basis-0 items-center justify-center rounded-lg border'>Cancel</Dialog.Trigger>
            <button
              disabled={addStudentMutation.isPending}
              onClick={() => {
                setOpen(false)
                addStudentMutation.mutate({
                  groupId: group.id,
                  studentId: student.id,
                })
              }}
              className={clsx('bg-halftone flex h-8 grow basis-0 items-center justify-center rounded-lg border bg-zinc-900 text-zinc-200 hover:bg-zinc-800')}
            >
              {addStudentMutation.isPending ? <TbLoader className='size-5 animate-spin' /> : 'Continue'}
            </button>
          </footer>
        </article>
      </Dialog.Root>
    </>
  )
}
