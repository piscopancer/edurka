import { auth } from '@/actions/users'
import '@/assets/style.scss'
import { hasCookie } from '@/cookies'
import { prefetchNotifications } from '@/notifications'
import { project } from '@/project'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Footer from './()/footer'
import Header from './()/header'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const authUser = await auth()
  const tutorMode = (await hasCookie('tutor')) && !!authUser?.tutor
  const queryClient = new QueryClient()
  if (authUser) {
    await prefetchNotifications(queryClient, authUser.id)
    await queryClient.prefetchQuery({
      queryKey: ['auth-user'],
      queryFn: () => auth(),
      initialData: authUser,
    })
  }

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header tutorMode={tutorMode} />
      </HydrationBoundary>
      <div className='relative grow'>{children}</div>
      <Footer />
    </>
  )
}
