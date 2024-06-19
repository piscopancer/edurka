import { getAuthUser } from '@/query/hooks'
import { route } from '@/utils'
import { QueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  const qc = new QueryClient()
  const authUser = getAuthUser(qc)
  if (authUser && !authUser.confirmed) {
    redirect(route('/confirm/send'))
  }

  return children
}
