import { auth } from '@/actions/users'
import '@/assets/style.scss'
import { hasCookie } from '@/cookies'
import { project } from '@/project'
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

  return (
    <>
      <Header user={authUser} tutorMode={tutorMode} />
      <div className='grow'>{children}</div>
      <Footer />
    </>
  )
}
