import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { queryKeys } from '@/query'
import { route } from '@/utils'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { coursesPagePathSchema } from './()'
import { queryCreatedCourses, queryParticipatedCourses } from './()/actions'
import CourseCreator from './()/course-creator'
import Courses from './()/courses'
import FilterPanel from './()/filter-panel'

export default async function CoursesPage(path: unknown) {
  const parseRes = coursesPagePathSchema.safeParse(path)
  if (!parseRes.success) {
    return 'Invalid path'
  }

  const authUser = await auth()
  if (!authUser) return
  if (!authUser.confirmed) {
    redirect(route('/confirm/send'))
  }
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  const qc = new QueryClient()
  if (tutorMode) {
    await qc.prefetchQuery({ queryKey: queryKeys.createdCourses(authUser.id), queryFn: () => queryCreatedCourses(authUser.id) })
  } else {
    await qc.prefetchQuery({ queryKey: queryKeys.participatedCourses(authUser.id), queryFn: () => queryParticipatedCourses(authUser.id) })
  }

  return (
    <main className=''>
      <header className='mb-4 flex h-28 items-center border-b'>
        <div className='mx-auto flex w-full max-w-screen-xl items-center max-xl:mx-4'>
          <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created courses' : 'My courses'}</h1>
          {tutorMode && <CourseCreator authUser={authUser} />}
        </div>
      </header>
      <HydrationBoundary state={dehydrate(qc)}>
        <FilterPanel className='mx-auto mb-6 max-w-screen-xl max-xl:mx-4' />
        <Courses tutorMode={tutorMode} className='mx-auto max-w-screen-xl max-xl:mx-4' />
      </HydrationBoundary>
    </main>
  )
}
