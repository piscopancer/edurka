import { auth, queryNotifications } from '@/actions/users'
import '@/assets/style.scss'
import { AuthUser } from '@/auth'
import { getCookie } from '@/cookies'
import { project } from '@/project'
import { queryKeys } from '@/query'
import { qc } from '@/query/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Footer from './()/footer'
import Header from './()/header'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: queryKeys.authUser,
    queryFn: () => auth(),
  })
  const authUser = qc.getQueryData<AuthUser>(queryKeys.authUser)
  await qc.prefetchQuery({
    queryKey: queryKeys.notifications(authUser?.id),
    queryFn: async () => (authUser ? await queryNotifications(authUser.id) : []),
  })
  await qc.prefetchQuery({
    queryKey: queryKeys.tutorMode(authUser?.id),
    queryFn: async () => (authUser ? !!(await getCookie('tutor')) && authUser.tutor : false),
  })

  return (
    <>
      <HydrationBoundary state={dehydrate(qc)}>
        <Header />
        <div className='relative grow'>{children}</div>
        <Footer />
      </HydrationBoundary>
    </>
  )
}
