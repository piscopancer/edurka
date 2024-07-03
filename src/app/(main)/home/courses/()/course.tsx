'use client'

import * as Dialog from '@/components/dialog'
import { Tooltip } from '@/components/tooltip'
import { useAuthUser } from '@/query/hooks'
import { formatDate } from '@/utils'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, useState } from 'react'
import { TbDotsVertical, TbExternalLink, TbPlus, TbTrash, TbUsersGroup, TbX } from 'react-icons/tb'
import { type Course } from '.'
import { useDeleteCourseMutation } from './hooks'

// attached works and tasks will not be deleted. however, all progress (users' submitted works) will be deleted.

export default function Course({ course, tutorMode, ...props }: ComponentProps<'article'> & { tutorMode: boolean; course: Course }) {
  const { data: authUser } = useAuthUser()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <article {...props} className={clsx(props.className, 'rounded-xl border shadow @container')}>
        <header className='grid grid-cols-[1fr,auto]'>
          <h2 className='mb-1 ml-4 mt-2 w-fit text-xl hover:underline'>
            <Link href={`/home/course/${course.id}`}>{course.title}</Link>
          </h2>
          <Popover.Root>
            <Popover.Trigger className='px-2'>
              <TbDotsVertical className='size-5' />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align='end' side='top' className='w-64'>
                <menu className='rounded-xl border bg-zinc-200 py-2 shadow'>
                  <button onClick={() => setDeleteDialogOpen(true)} className='flex w-full items-center border-y border-transparent px-4 py-2 hover:border-inherit'>
                    <span className='mr-auto'>Delete</span>
                    <TbTrash className='size-5' />
                  </button>
                </menu>
                <Popover.Arrow className='w-3' />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </header>
        {tutorMode && (
          <nav className='flex border-b border-dashed px-4 pb-2 text-sm'>
            <button className='rounded-lg border px-3 py-0.5'>Works</button>
            <button className='rounded-lg border border-transparent px-3 py-0.5'>Completion</button>
          </nav>
        )}
        <ul className='flex flex-wrap gap-1 border-b border-dashed px-4 py-2'>
          {course.works.map((work) => (
            <li key={work.id}>
              <Tooltip
                delay={0}
                content={
                  <article className='grid grid-cols-[1fr,auto] gap-x-2 py-1 pl-1'>
                    <h1 className='mb-1'>{work.title}</h1>
                    <TbExternalLink className='row-span-2 size-4' />
                    <p className='text-xs'>{formatDate(work.createdAt as Date)}</p>
                    {/* additional info if expires, also show sandclock */}
                  </article>
                }
              >
                <button onClick={() => console.log(work.id)} className='flex size-6 rounded-md border'></button>
              </Tooltip>
            </li>
          ))}
          {tutorMode && (
            <li>
              <Tooltip content='Add or create a new work'>
                <button className='flex size-6 items-center justify-center rounded-md border'>
                  <TbPlus />
                </button>
              </Tooltip>
            </li>
          )}
        </ul>
        <div className='flex gap-x-4 px-4 py-1 text-sm'>
          {authUser?.id !== course.tutor.id && (
            <Tooltip content={`See tutor's page`}>
              <Link href={'/'} className='hover:underline'>
                {course.tutor.surname} {course.tutor.name} {course.tutor.middlename}
              </Link>
            </Tooltip>
          )}
          <span>{formatDate(course.createdAt as Date)}</span>
        </div>
      </article>
      <DeleteDialog course={course} deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} />
    </>
  )
}

function DeleteDialog({ course, deleteDialogOpen, setDeleteDialogOpen }: { course: Course; deleteDialogOpen: boolean; setDeleteDialogOpen: (value: boolean) => void }) {
  const [confirmCourseTitle, setConfirmCourseTitle] = useState('')
  const deleteCourseMutation = useDeleteCourseMutation(course.id)

  return (
    <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} contentProps={{ size: 'sm' }}>
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
          <p className='mb-1 text-xl'>{course.title}</p>
          <div className='flex items-center justify-center text-sm'>
            <span>
              <span className='rounded-md border px-1.5'>{course._count.groups}</span> groups and <span className='rounded-md border px-1.5'>{course._count.students}</span>{' '}
              individual students currently participate
            </span>
          </div>
        </div>
        <footer className='px-4 py-4'>
          <p className='mb-4 rounded-lg text-center text-sm text-accent-dark'>
            Upon deletion of the course, attached works and tasks will not be deleted. However, all progress (users' submitted works) will be deleted along with the course.
          </p>
          <fieldset className='mb-4'>
            <label htmlFor='confirm' className='mb-2 block text-center'>
              To confirm, type <span className='font-semibold'>{course.title}</span> in the input below
            </label>
            <input
              value={confirmCourseTitle}
              autoFocus
              autoComplete='off'
              id='confirm'
              type='text'
              onChange={(e) => setConfirmCourseTitle(e.target.value)}
              className='w-full rounded-lg border px-4 py-2'
            />
          </fieldset>
          <div className='flex w-full gap-2'>
            <button
              onClick={() => {
                setDeleteDialogOpen(false)
              }}
              className='grow basis-0 rounded-lg border px-4 py-1'
            >
              Cancel
            </button>
            <button
              disabled={confirmCourseTitle.trim() !== course.title}
              onClick={() => {
                setDeleteDialogOpen(false)
                deleteCourseMutation.mutate({ courseId: course.id })
              }}
              className='grow basis-0 rounded-lg border bg-zinc-900 px-4 py-1 disabled:bg-halftone enabled:text-zinc-200 enabled:hover:bg-zinc-800'
            >
              Delete
            </button>
          </div>
        </footer>
      </>
    </Dialog.Root>
  )
}
