import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { route } from '@/utils'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'
import Navigaton from '../()/navigation'

export default async function TasksPage() {
  const authUser = (await auth()) as User
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  if (!authUser.tutor) {
    redirect(route('/home/courses'))
  }

  return (
    <main className='mx-4'>
      <header className=''>
        <Navigaton tutorMode={tutorMode} />
      </header>
    </main>
  )
}
