import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { route } from '@/utils'
import { redirect } from 'next/navigation'
import CourseCreator from './()/course-creator'
import { queryCreatedCourses } from './()/server'

export default async function CoursesPage() {
  const authUser = await auth()
  if (!authUser) return
  if (!authUser.confirmed) {
    redirect(route('/confirm/send'))
  }
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  const courses = await queryCreatedCourses(authUser.id)

  return (
    <main className=''>
      <header className='flex h-28 items-center border-b-2 border-zinc-300'>
        <div className='mx-auto flex w-full max-w-screen-xl items-center'>
          <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created courses' : 'My courses'}</h1>
          {tutorMode && <CourseCreator authUser={authUser} />}
        </div>
      </header>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.id}, {course.title}
          </li>
        ))}
      </ul>
    </main>
  )
}
