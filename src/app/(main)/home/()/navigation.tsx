'use client'

import { route } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type NavOption = {
  title: string
  route: string
}

function getRoutes({ tutorMode }: { tutorMode: boolean }) {
  const routes = [
    { title: 'Courses', route: route('/home/courses') },
    { title: 'Groups', route: route('/home/groups') },
  ] satisfies NavOption[]
  if (tutorMode) routes.push({ title: 'Tasks', route: '/home/tasks' })
  return routes
}

export default function Navigaton({ tutorMode, ...props }: ComponentProps<'nav'> & { tutorMode: boolean }) {
  const path = usePathname()
  const routes = getRoutes({ tutorMode })

  return (
    <nav {...props} className={clsx(props.className, '')}>
      {routes.map((r) => (
        <Link key={r.route} href={r.route} className={clsx('', path.includes(r.route) ? 'underline' : '')}>
          {r.title}
        </Link>
      ))}
    </nav>
  )
}
