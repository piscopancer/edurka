'use client'

import { deleteNotification } from '@/actions/notifications'
import { Notifications, type Notification } from '@/notifications'
import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { $Enums } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, ReactNode } from 'react'
import { IconType } from 'react-icons/lib'
import { TbStack3, TbUsersGroup, TbX } from 'react-icons/tb'

const NotificationsContents = {
  AddedToCourseNotification: AddedToCourseNotification,
  AddedToGroupNotification: AddedToGroupNotification,
} satisfies { [T in $Enums.NotificationType]: (props: { notification: Notification<T> }) => ReactNode }

const NotificationsIcons = {
  AddedToCourseNotification: TbStack3,
  AddedToGroupNotification: TbUsersGroup,
} satisfies { [T in $Enums.NotificationType]: IconType }

export default function Notification({ notification, ...props }: ComponentProps<'article'> & { notification: Notifications }) {
  const authUser = useAuthUser()
  const deleteNotificationMutation = useDeleteNotificationMutation()
  const Content = NotificationsContents[notification.type]
  const Icon = NotificationsIcons[notification.type]

  return (
    <article {...props} className={clsx(props.className, 'flex items-center gap-4')}>
      <Icon className='size-8 rounded-full border border-accent bg-accent/10 stroke-accent p-1.5' />
      <Content notification={notification as never} />
      <button
        onClick={() => {
          if (authUser.data) {
            deleteNotificationMutation.mutate({ userId: authUser.data.id, id: notification.id })
          }
        }}
        className='flex aspect-square size-6 items-center justify-center rounded-full border border-transparent hover:border-inherit'
      >
        <TbX className='' />
      </button>
    </article>
  )
}

function useDeleteNotificationMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (props: { userId: number; id: number }) => deleteNotification(props.id),
    onMutate: async (props) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications(props.userId) })
      const prev = qc.getQueryData<Notifications[]>(queryKeys.notifications(props.userId))
      qc.setQueriesData<Notifications[]>({ queryKey: queryKeys.notifications(props.userId) }, (prevNtfs) => prevNtfs?.filter((ntf) => ntf.id !== props.id))
      return { prev }
    },
    onError(err, props, ctx) {
      if (ctx?.prev) {
        qc.setQueriesData<Notifications[]>({ queryKey: queryKeys.notifications(props.userId) }, ctx.prev)
        console.error(err, props.id)
      }
    },
  })
}

function AddedToCourseNotification({ notification }: { notification: Notification<'AddedToCourseNotification'> }) {
  return (
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
  )
}

function AddedToGroupNotification({ notification }: { notification: Notification<'AddedToGroupNotification'> }) {
  return (
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
  )
}
