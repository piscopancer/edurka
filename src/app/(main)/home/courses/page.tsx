import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { User } from '@prisma/client'
import Navigaton from '../()/navigation'
import CourseCreator from './()/course-creator'

export default async function CoursesPage() {
  const authUser = (await auth()) as User
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  return (
    <main className='mx-4'>
      <header className=''>
        <Navigaton tutorMode={tutorMode} />
      </header>
      {tutorMode && <CourseCreator tutorId={authUser.id} />}
    </main>
  )
}
