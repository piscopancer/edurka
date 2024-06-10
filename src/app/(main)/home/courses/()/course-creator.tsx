'use client'

import { createCourse } from '@/actions/courses'
import { Course, User } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ComponentProps, useId, useRef, useState } from 'react'
import { TbX } from 'react-icons/tb'
import { searchStudents } from './actions'

// title, description (tiptap editor, db type json), connect works, connect group,

export default function CourseCreator({ authUser }: { authUser: User }) {
  const [open, setOpen] = useState(false)

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
                <div className='mx-4'>
                  <CourseForm tutorId={authUser.id} />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function CourseForm({ tutorId, ...props }: ComponentProps<'article'> & Pick<Course, 'tutorId'>) {
  const createCourseMutation = useMutation({ mutationFn: createCourse })
  const titleInputRef = useRef<HTMLInputElement>(null!)
  const titleId = useId()
  const searchStudentsId = useId()
  const searchStudentsMutation = useMutation({ mutationFn: searchStudents })
  type Student = NonNullable<(typeof searchStudentsMutation)['data']>[number]
  const [foundStudents, setFoundStudents] = useState<Student[]>([])
  const [studentsToInclude, setStudentsToInclude] = useState<Student[]>([])

  return (
    <article {...props} className={clsx(props.className, '')}>
      <fieldset>
        <label htmlFor={titleId} className='mb-1 text-sm'>
          Title
        </label>
        <input id={titleId} ref={titleInputRef} type='text' className='rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      {/*  */}
      <fieldset>
        <label htmlFor={searchStudentsId} className='mb-1 text-sm'>
          Search students (name, surname, middlename or email)
        </label>
        <input
          id={searchStudentsId}
          ref={titleInputRef}
          onChange={async (e) => {
            const foundStudents = await searchStudentsMutation.mutateAsync({
              tutorId,
              search: e.target.value.trim(),
            })
            setFoundStudents(foundStudents)
          }}
          type='text'
          className='rounded-md bg-zinc-300 px-3 py-2'
        />
      </fieldset>
      <ul>
        {foundStudents.map((student) => (
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
        ))}
      </ul>
      {/*  */}
      <button
        onClick={async () => {
          await createCourseMutation.mutateAsync({
            data: {
              title: titleInputRef.current.value.trim(),
              tutorId,
              // students: {
              // connect: {
              // id:
              // },
              // },
            },
          })
        }}
      >
        Create Course
      </button>
    </article>
  )
}
