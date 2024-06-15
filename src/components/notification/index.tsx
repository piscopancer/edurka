'use client'

import { deleteNotification } from '@/actions/notifications'
import { Notifications, type Notification } from '@/notifications'
import { $Enums } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, ReactNode } from 'react'
import { TbStack2, TbUsersGroup, TbX } from 'react-icons/tb'

const NotificationsComponents = {
  AddedToCourseNotification: AddedToCourseNotification,
  AddedToGroupNotification: AddedToGroupNotification,
} satisfies { [T in $Enums.NotificationType]: (props: { notification: Notification<T> }) => ReactNode }

export default function Notification({ notification, ...props }: ComponentProps<'article'> & { notification: Notifications }) {
  const NotificationComponent = NotificationsComponents[notification.type]

  return (
    <article {...props} className={clsx(props.className, 'flex')}>
      <NotificationComponent notification={notification as never} />
    </article>
  )
}

function useDeleteNotificationMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['notifications'] })
      const prev = qc.getQueryData<Notifications[]>(['notifications'])
      qc.setQueriesData<Notifications[]>({ queryKey: ['notifications'] }, (prevNtfs) => prevNtfs?.filter((ntf) => ntf.id !== id))
      return { prev }
    },
    onError(err, id, ctx) {
      if (ctx?.prev) {
        qc.setQueriesData<Notifications[]>({ queryKey: ['notifications'] }, ctx.prev)
        console.error(err, id)
      }
    },
  })
}

function AddedToCourseNotification({ notification }: { notification: Notification<'AddedToCourseNotification'> }) {
  const deleteNotificationMutation = useDeleteNotificationMutation()

  return (
    <div className='flex items-center gap-4'>
      <TbStack2 className='size-8 rounded-full border border-accent bg-accent/10 stroke-accent p-1.5' />
      <p className='text-sm'>
        Tutor {/* href to user page */}
        <Link href={'/'} className='border-b border-accent/20 text-accent duration-100 hover:border-accent'>
          {notification.sender.name} {notification.sender.middlename}
        </Link>{' '}
        added you to the course{' '}
        <Link href={'/'} className='border-b border-accent/20 text-accent duration-100 hover:border-accent'>
          {notification.course.title}
        </Link>
      </p>
      <button
        onClick={() => {
          deleteNotificationMutation.mutate(notification.id)
        }}
        className='flex aspect-square size-6 items-center justify-center rounded-full border border-transparent hover:border-inherit'
      >
        <TbX className='' />
      </button>
    </div>
  )
}

function AddedToGroupNotification({ notification }: { notification: Notification<'AddedToGroupNotification'> }) {
  const deleteNotificationMutation = useDeleteNotificationMutation()

  return (
    <div className='flex items-center gap-4'>
      <TbUsersGroup className='size-8 rounded-full border border-accent bg-accent/10 stroke-accent p-1.5' />
      <p className='text-sm'>
        Tutor {/* href to user page */}
        <Link href={'/'} className='border-b border-accent/20 text-accent duration-100 hover:border-accent'>
          {notification.sender.name} {notification.sender.middlename}
        </Link>{' '}
        added you to the group{' '}
        <Link href={'/'} className='border-b border-accent/20 text-accent duration-100 hover:border-accent'>
          {notification.group.title} <span className='rounded-md bg-accent/20 px-1.5 text-xs text-accent'>{notification.group._count.students}</span>
        </Link>
      </p>
      <button
        onClick={() => {
          deleteNotificationMutation.mutate(notification.id)
        }}
        className='flex aspect-square size-6 items-center justify-center rounded-full border border-transparent hover:border-inherit'
      >
        <TbX className='' />
      </button>
    </div>
  )
}
