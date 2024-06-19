'use client'

import Search from '@/components/search'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuthUser } from '@/query/hooks'
import { formatDate } from '@/utils'
import { Course } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ComponentProps, useEffect, useId, useRef, useState } from 'react'
import { TbLoader, TbPlus, TbUser, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { createCourse, findParticipants } from './actions'
import { createCourseStore } from './store'

export default function CourseCreator() {
  const { data: authUser } = useAuthUser()
  const [open, setOpen] = useState(false)
  const createCourseMutation = useMutation({ mutationFn: createCourse })

  if (!authUser) return

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className='rounded-lg bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New course</button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div className='z-[1]' exit={{ opacity: 0, transition: { duration: 0.2 } }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dialog.Overlay className='bg-halftone fixed inset-0' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div
                exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { ease: 'backOut' } }}
                className='fixed inset-0 z-[1] mx-auto my-4 flex max-w-screen-lg grow flex-col rounded-xl border bg-zinc-200 @container max-md:my-0'
              >
                <Dialog.Trigger className='ml-auto'>
                  <TbX className='size-16 p-4' />
                </Dialog.Trigger>
                <div className='grow overflow-y-auto px-4'>
                  <CourseForm tutorId={authUser.id} />
                </div>
                <footer className='flex justify-end gap-x-4 border-t border-dashed p-4'>
                  <button className='rounded-lg border px-4 py-2'>Clear</button>
                  <button
                    onClick={() => {
                      createCourseMutation.mutateAsync({
                        title: createCourseStore.title,
                        tutorId: authUser.id,
                        groupsIds: createCourseStore.includedGroups.map((g) => g.id),
                        studentsIds: createCourseStore.includedStudents.map((s) => s.id),
                        worksIds: createCourseStore.includedWorks.map((w) => w.id),
                      })
                    }}
                    disabled={createCourseMutation.isPending}
                    className='hopper rounded-lg bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50'
                  >
                    <TbLoader className={clsx('animate-spin place-self-center', !createCourseMutation.isPending && 'invisible')} />
                    <span className={clsx('place-self-center', createCourseMutation.isPending && 'invisible')}>Create</span>
                  </button>
                </footer>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function CourseForm({ tutorId, ...props }: ComponentProps<'article'> & Pick<Course, 'tutorId'>) {
  const titleInputRef = useRef<HTMLInputElement>(null!)
  const titleId = useId()
  const descriptionId = useId()
  const findParicipantsId = useId()
  const [search, setSearch] = useState('')
  const searchDebouncer = useDebounce({
    callback(search: string) {
      createCourseStore.participantsSearch = search
    },
    seconds: 0.7,
  })
  const createCourseSnap = useSnapshot(createCourseStore)
  const findParticipantsQuery = useQuery({
    queryFn: () => findParticipants(createCourseSnap.participantsSearch),
    queryKey: ['found-participants'],
    enabled: !!createCourseSnap.participantsSearch,
  })

  useEffect(() => {
    findParticipantsQuery.refetch()
  }, [createCourseSnap.participantsSearch])

  return (
    <article {...props} className={clsx(props.className, '')}>
      <fieldset className='mb-3'>
        <label htmlFor={titleId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Title</span>
          <span className='text-sm'>
            It reflects the field of work or takes after the name of a discipline. E.g. <i>Fundamentals of English grammar</i>.
          </span>
        </label>
        <input
          id={titleId}
          ref={titleInputRef}
          defaultValue={createCourseSnap.title}
          onChange={(e) => (createCourseStore.title = e.target.value.trim())}
          type='text'
          className='w-full rounded-lg border px-4 py-2 shadow'
        />
      </fieldset>
      <fieldset className='mb-4'>
        <label htmlFor={descriptionId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Description</span>
          <span className='text-sm'>
            Provide meaningful description for students explaining what topics are going to be covered and what skills will be focused for improving. It's also recommended to lay
            out a plan of the course and provide external links to useful sources.
          </span>
        </label>
        <textarea id={descriptionId} className='min-h-[3lh] w-full rounded-lg border px-4 py-2 shadow' />
      </fieldset>
      <fieldset>
        <label htmlFor={findParicipantsId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Include groups and students</span>
          <span className='text-sm'>
            By including groups you will provide certain students with access to this course as long as they consist in the selected group. By icluding particular students you may
            provide a personal access to the course for some exclusive students.
          </span>
        </label>
        <Search
          change={(value) => {
            setSearch(value)
            searchDebouncer.call(value)
          }}
          id={findParicipantsId}
          defaultValue={search}
          clear={() => {
            createCourseStore.participantsSearch = ''
          }}
          loading={findParticipantsQuery.isFetching}
          className='mb-4 mr-4'
        />
      </fieldset>
      <div className='mb-24 grid grid-cols-2 grid-rows-[auto,auto,1fr,auto] gap-x-4'>
        <div className='row-span-full grid grid-rows-subgrid'>
          <h2 className='mb-1 text-lg font-medium'>Groups</h2>
          <p className='mb-2 text-sm'>Found: {findParticipantsQuery.data?.groups.length}</p>
          {findParticipantsQuery.data && (
            <ul>
              {[...createCourseSnap.includedGroups, ...findParticipantsQuery.data.groups.filter(({ id }) => !createCourseSnap.includedGroups.some((g) => g.id === id))].map(
                (group) => (
                  <li key={group.id} className=''>
                    <Group group={group} />
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
        <div className='row-span-full grid grid-rows-subgrid'>
          <h2 className='mb-1 text-lg font-medium'>Students</h2>
          <p className='mb-2 text-sm'>Found: {findParticipantsQuery.data?.students.length}</p>
          {findParticipantsQuery.data && (
            <ul className='flex flex-col'>
              {[...createCourseSnap.includedStudents, ...findParticipantsQuery.data.students.filter(({ id }) => !createCourseSnap.includedStudents.some((s) => s.id === id))].map(
                (student) => (
                  <li key={student.id} className='border-b border-dashed py-2 first:border-t'>
                    <Student student={student} />
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}

function Group({ group, ...props }: ComponentProps<'article'> & { group: (typeof createCourseStore.includedGroups)[number] }) {
  const createCourseSnap = useSnapshot(createCourseStore)
  const included = createCourseSnap.includedGroups.some((g) => g.id === group.id)

  return (
    <article {...props} className={clsx(props.className, 'grid grid-cols-[auto,1fr,auto] gap-x-2 rounded-lg border px-3 py-2 shadow')}>
      <div className='hopper row-span-2 self-center'>
        <TbUser className='bg-halftone ml-6 size-12 rounded-full border border-dashed bg-zinc-200 p-2' />
        <TbUser className='bg-halftone ml-3 size-12 rounded-full border border-dashed bg-zinc-200 p-2' />
        <TbUser className='size-12 rounded-full border bg-zinc-200 stroke-1 p-2' />
      </div>
      <h2 className='font-medium'>{group.title}</h2>
      <button
        onClick={() => {
          if (included) {
            createCourseStore.includedGroups = createCourseStore.includedGroups.filter((g) => g.id !== group.id)
          } else {
            createCourseStore.includedGroups.push(group)
          }
        }}
        className={clsx('flex items-center justify-center rounded-lg border py-1 text-sm', included ? 'bg-halftone' : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800')}
      >
        <TbPlus className={clsx('inline-block size-5 duration-200', included && 'rotate-45')} />
      </button>
      <p className='text-sm'>{group._count.students} student(-s)</p>
      <time className='mt-auto justify-self-end text-xs'>{formatDate(group.createdAt)}</time>
    </article>
  )
}

function Student({ student, ...props }: ComponentProps<'article'> & { student: (typeof createCourseStore.includedStudents)[number] }) {
  const authUserQuery = useAuthUser()
  const createCourseSnap = useSnapshot(createCourseStore)
  const included = createCourseSnap.includedStudents.some((s) => s.id === student.id)

  return (
    <article {...props} className={clsx(props.className, 'grid grid-cols-[1fr,auto] gap-x-2')}>
      <h2 className='line-clamp-1'>
        {student.surname} {student.name} {student.middlename}{' '}
        {authUserQuery.data?.id === student.id && <span className='rounded-md border px-2 py-0.5 align-middle text-xs'>You</span>}
      </h2>
      <button
        onClick={() => {
          if (included) {
            createCourseStore.includedStudents = createCourseStore.includedStudents.filter((s) => s.id !== student.id)
          } else {
            createCourseStore.includedStudents.push(student)
          }
        }}
        className={clsx('flex items-center justify-center rounded-lg border px-4 py-1 text-sm', included ? 'bg-halftone' : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800')}
      >
        <TbPlus className={clsx('inline-block duration-200', included && 'rotate-45')} />
      </button>
    </article>
  )
}
