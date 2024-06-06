import { db } from '#/prisma'
import { auth } from '@/actions'
import { route } from '@/utils'
import { redirect } from 'next/navigation'
import Course from './()/course'

export default async function Home() {
  const authUser = await auth()

  if (!authUser) {
    redirect(route('/'))
    return
  }

  const courses = await db.course.findMany({
    where: {
      students: {
        some: {
          id: authUser.id,
        },
      },
    },
  })

  return (
    <main className=''>
      <header>
        <h1>My courses</h1>
      </header>
      <ul>
        {courses?.map((course) => (
          <li key={course.id}>
            <Course authUser={authUser} course={course} />
          </li>
        ))}
      </ul>
    </main>
  )
}
