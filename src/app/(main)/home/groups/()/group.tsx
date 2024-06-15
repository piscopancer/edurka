'use client'

import { AuthUser } from '@/auth'
import { formatDate } from '@/utils'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { type Group } from '.'

// title, created at, number of participants,

export default function Group({ authUser, group, ...props }: ComponentProps<'article'> & { authUser: AuthUser; group: Group }) {
  return (
    <article {...props} className={clsx(props.className, 'rounded-md border-2 border-zinc-300 px-4 py-2')}>
      <time className='text-sm'>{formatDate(group.createdAt as Date)}</time>
      <h1 className='text-xl'>{group.title}</h1>
      {group._count && <p>{group._count.students}</p>}
    </article>
  )
}
