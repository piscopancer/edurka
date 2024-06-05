import { auth } from '@/actions'
import '@/assets/style.scss'
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

  return (
    <>
      <Header user={authUser} />
      <div className='grow'>{children}</div>
      <Footer />
    </>
  )
}
