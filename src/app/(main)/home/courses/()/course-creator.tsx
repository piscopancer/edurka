'use client'

import { createCourse } from '@/actions/courses'
import Search from '@/components/search'
import Switch from '@/components/switch'
import { formatDate } from '@/utils'
import { Course, User } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ComponentProps, useId, useRef, useState } from 'react'
import { TbMoodSmile, TbPlus, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { findGroups } from './actions'
import { createCourseStore } from './store'

export default function CourseCreator({ authUser }: { authUser: User }) {
  const [open, setOpen] = useState(false)
  const createCourseMutation = useMutation({ mutationFn: createCourse })
  const createCourseSnap = useSnapshot(createCourseStore)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className='rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New course</button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div className='z-[1]' exit={{ opacity: 0, transition: { duration: 0.2 } }} initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>
              <Dialog.Overlay className='fixed inset-0 bg-black' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div
                exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { ease: 'backOut' } }}
                className='fixed inset-0 z-[1] mx-auto my-4 flex max-w-screen-lg grow flex-col rounded-md bg-zinc-200 @container max-md:my-0'
              >
                <Dialog.Trigger className='ml-auto block text-zinc-400 duration-100 hover:text-zinc-500'>
                  <TbX className='size-16 p-4' />
                </Dialog.Trigger>
                <div className='mx-4 grow'>
                  <CourseForm tutorId={authUser.id} />
                </div>
                <footer className='flex justify-end gap-x-4 border-t-2 border-zinc-300 p-4'>
                  <button className='rounded-md bg-zinc-300 px-4 py-2 duration-100 hover:bg-zinc-400'>Clear</button>
                  <button
                    onClick={async () => {
                      await createCourseMutation.mutateAsync({
                        data: {
                          title: createCourseStore.title,
                          tutorId: authUser.id,
                          groups: {
                            connect: createCourseStore.groupsIds.map((groupId) => ({ id: groupId })),
                          },
                          works: {
                            connect: createCourseStore.worksIds.map((workId) => ({ id: workId })),
                          },
                        },
                      })
                    }}
                    className='rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'
                  >
                    Create
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
  const findGroupsId = useId()
  const findGroupsMutation = useMutation({ mutationFn: findGroups })
  type Student = NonNullable<(typeof findGroupsMutation)['data']>[number]
  const [foundGroups, setFoundGroups] = useState<Student[]>([])
  const [groupsSearch, setGroupsSearch] = useState('')
  const [studentsSearch, setStudentsSearch] = useState('')
  const createCourseSnap = useSnapshot(createCourseStore)

  return (
    <article {...props} className={clsx(props.className, '')}>
      <fieldset className='mb-3'>
        <label htmlFor={titleId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Title</span>
          <span className='text-sm'>
            It reflects the field of work or takes after the name of a discipline. E.g. <i>Fundametnals of English grammar</i>.
          </span>
        </label>
        <input id={titleId} ref={titleInputRef} type='text' className='w-full rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      <fieldset className='mb-4'>
        <label htmlFor={descriptionId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Description</span>
          <span className='text-sm'>
            Provide meaningful description for students explaining what topics are going to be covered and what skills will be focused for improving. It's also recommended to lay
            out a plan of the course and provide external links to useful sources.
          </span>
        </label>
        <textarea id={descriptionId} className='min-h-[3lh] w-full rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      <fieldset>
        <label htmlFor={findGroupsId} className='mb-2 block'>
          <span className='mb-1 block text-xl font-medium'>Include groups</span>
          <span className='text-sm'>By including groups the </span>
        </label>
        <div className='mb-4 flex'>
          <Search
            change={async (value) => {
              setGroupsSearch(value)
              const foundGroups = await findGroupsMutation.mutateAsync({
                search: value,
              })
              setFoundGroups(foundGroups)
            }}
            inputId={findGroupsId}
            value={groupsSearch}
            clear={() => {
              findGroupsMutation.reset()
              setGroupsSearch('')
            }}
            className='mr-4 grow'
          />
          <fieldset className='flex items-center gap-2'>
            <span>Show included</span>
            <Switch action={(value) => (createCourseStore.showIncludedGroups = value)} enabled={createCourseSnap.showIncludedGroups} />
          </fieldset>
        </div>
      </fieldset>
      <ul className='grid grid-cols-2 gap-4'>
        {foundGroups.map((group) => (
          <li key={group.id} className=''>
            <Group group={group} />
          </li>
        ))}
        {/* {foundStudents.map((student) => (
          <li key={student.id}>
            <span>
              {student.name} {student.surname}
            </span>{' '}
            <span>{student.participatedCourses.length}</span>
            <button
              onClick={() => {
                setStudentsToInclude((prev) => [...prev, student])
              }}
            >
              +
            </button>
          </li>
        ))} */}
      </ul>
      {/*  */}
    </article>
  )
}

function Group({ group, ...props }: ComponentProps<'article'> & { group: Awaited<ReturnType<typeof findGroups>>[number] }) {
  return (
    <article {...props} className={clsx(props.className, 'grid grid-cols-[auto,1fr,auto] gap-x-2 rounded-md border-2 border-zinc-300 px-3 py-2')}>
      <div className='hopper row-span-2 self-center'>
        <TbMoodSmile className='ml-6 size-12 rounded-full border-[3px] border-zinc-200 bg-zinc-300 stroke-zinc-500 p-1.5' />
        <TbMoodSmile className='ml-3 size-12 rounded-full border-[3px] border-zinc-200 bg-zinc-300 stroke-zinc-500 p-1.5' />
        <TbMoodSmile className='size-12 rounded-full border-[3px] border-zinc-200 bg-zinc-300 stroke-zinc-500 p-1.5' />
      </div>
      <h2 className='font-medium'>{group.title}</h2>
      <button
        onClick={() => createCourseStore.groupsIds.push(group.id)}
        className='flex items-center justify-center rounded-md bg-zinc-900 py-1 text-sm text-zinc-200 duration-100 hover:bg-zinc-800'
      >
        <TbPlus className='mr-2' />
        <span>Include</span>
      </button>
      <p className='text-sm text-zinc-600'>{group._count.students} student(-s)</p>
      <time className='mt-auto justify-self-end text-xs text-zinc-600'>{formatDate(group.createdAt)}</time>
    </article>
  )
}
