'use client'
import { Tooltip } from '@/components/tooltip'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { TbCheck, TbEdit, TbX } from 'react-icons/tb'
import { useCourseQuery, useUpdateCourseMutation } from '.'

export default function Title({ courseId, ...props }: { courseId: number } & ComponentProps<'div'>) {
  const [edit, setEdit] = useState(false)
  const { data: course } = useCourseQuery(courseId)
  const updateCourseMutation = useUpdateCourseMutation(courseId)
  let editedTitle = course?.title ?? ''

  if (!course) return null

  return (
    <div className={clsx(props.className, 'group grid grid-cols-[1fr,auto]')}>
      {edit ? (
        <input defaultValue={editedTitle} onChange={(e) => (editedTitle = e.target.value)} className='mr-2 block rounded-lg border px-4 text-2xl font-medium shadow' />
      ) : (
        <h1 className='text-3xl font-medium'>{course.title}</h1>
      )}
      {edit ? (
        <menu className='flex gap-2'>
          <button
            onClick={() => {
              setEdit(false)
            }}
            className='rounded-lg border'
          >
            <TbX className='size-10 p-2.5' />
          </button>
          <button
            onClick={() => {
              updateCourseMutation.mutate({
                id: courseId,
                title: editedTitle.trim(),
              })
              setEdit(false)
            }}
            className='rounded-lg border bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
          >
            <TbCheck className='size-10 p-2.5' />
          </button>
        </menu>
      ) : (
        <Tooltip content='Edit title'>
          <button onClick={() => setEdit((prev) => !prev)} className='rounded-lg border border-transparent hover:border-inherit'>
            <TbEdit className='size-10 p-2.5' />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
