'use client'

import * as Dialog from '@/components/dialog'
import Search from '@/components/search'
import { useDebounce } from '@/hooks/use-debounce'
import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { formatDate } from '@/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { TbLoader, TbUsersPlus, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { type Group } from '.'
import { addStudent, excludeStudent, queryStudents } from './server'
import { groupStore, tabs } from './store'

export default function Group({ group, ...props }: ComponentProps<'article'> & { group: Group }) {
  const { data: authUser } = useAuthUser()
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

  return (
    <article {...props} className={clsx(props.className, 'rounded-xl border px-4 py-2 shadow')}>
      <time className='text-xs'>{formatDate(group.createdAt as Date)}</time>
      <h1 className='mb-2 text-xl'>{group.title}</h1>
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md border px-2 text-sm'>{group.students.length} student(-s)</Dialog.Trigger>
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
                <TbUsersPlus className='mb-2 size-16 rounded-full bg-accent/10 stroke-accent p-4' />
                <p className='mb-6'>There are no students in this group</p>
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
    </article>
  )
}

function ParticipatingStudent({ student, i, group }: { student: (typeof group)['students'][number]; group: Group; i: number }) {
  const { data: authUser } = useAuthUser()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const isAuthUser = !!(authUser && authUser.id === student.id)
  const excludeStudentMutation = useMutation({
    mutationKey: ['exclude-student', group.id, student.id],
    mutationFn: excludeStudent,
    async onMutate({ groupId, studentId }) {
      setOpen(false)
      const prev = qc.getQueryData<Group[]>(queryKeys.createdGroups(authUser?.id))
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prevGroups) =>
        prevGroups?.map((g) => ({
          ...g,
          students: g.id === groupId ? g.students.filter((s) => s.id !== studentId) : g.students,
        })),
      )
      return { prev }
    },
    onError(err, props, ctx) {
      if (ctx?.prev) {
        qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), ctx.prev)
        console.log(err)
      }
    },
  })

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
            submitted works will be wiped too
          </p>
          <footer className='flex gap-x-2 border-t px-4 py-3'>
            <Dialog.Trigger className='flex h-8 grow basis-0 items-center justify-center rounded-lg border'>Cancel</Dialog.Trigger>
            <button
              disabled={excludeStudentMutation.isPending}
              onClick={() => {
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
  const { data: authUser } = useAuthUser()
  const isParticipant = group.students.some((s) => s.id === student.id)
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()
  const addStudentMutation = useMutation({
    mutationKey: ['add-student', group.id, student.id],
    mutationFn: addStudent,
    async onMutate({ groupId }) {
      setOpen(false)
      await qc.invalidateQueries({ queryKey: queryKeys.createdGroups(authUser?.id) })
      const prev = qc.getQueryData<Group[]>(queryKeys.createdGroups(authUser?.id))
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prevGroups) =>
        prevGroups?.map((g) => {
          if (g.id === groupId) {
            g.students.push(student)
          }
          return g
        }),
      )
      return { prev }
    },
    onError(err, props, ctx) {
      if (ctx?.prev) {
        qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), ctx.prev)
        console.log(err)
      }
    },
  })

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
            to the group <span className='font-semibold'>{group.title}</span>. They will be granted access to the courses in which this group participates.
          </p>
          <footer className='flex gap-x-2 border-t px-4 py-3'>
            <Dialog.Trigger className='flex h-8 grow basis-0 items-center justify-center rounded-lg border'>Cancel</Dialog.Trigger>
            <button
              disabled={addStudentMutation.isPending}
              onClick={() => {
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
