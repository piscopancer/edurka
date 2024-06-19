import { queryKeys } from '@/query'
import { getAuthUser, getTutorMode } from '@/query/hooks'
import { qc } from '@/query/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { coursesPageUrlSchema } from './()'
import { queryCreatedCourses, queryParticipatedCourses } from './()/actions'
import CourseCreator from './()/course-creator'
import Courses from './()/courses'
import FilterPanel from './()/filter-panel'

export default async function CoursesPage(url: unknown) {
  const parseRes = coursesPageUrlSchema.safeParse(url)
  if (!parseRes.success) {
    return 'Invalid path'
  }
  const authUser = getAuthUser(qc)
  const tutorMode = getTutorMode(qc)
  if (tutorMode) {
    await qc.prefetchQuery({
      queryKey: queryKeys.createdCourses(authUser?.id),
      queryFn: async () => (authUser ? await queryCreatedCourses(authUser.id, parseRes.data.searchParams) : []),
    })
  } else {
    await qc.prefetchQuery({
      queryKey: queryKeys.participatedCourses(authUser?.id),
      queryFn: async () => (authUser ? await queryParticipatedCourses(authUser.id, parseRes.data.searchParams) : []),
    })
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <main className=''>
        <header className='bg-halftone mb-4 flex h-28 items-center border-b'>
          <div className='mx-auto flex w-full max-w-screen-xl items-center max-xl:mx-4'>
            <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created courses' : 'My courses'}</h1>
            {tutorMode && <CourseCreator />}
          </div>
        </header>
        <FilterPanel className='mx-auto mb-6 max-w-screen-xl max-xl:mx-4' />
        <Courses className='mx-auto max-w-screen-xl max-xl:mx-4' />
      </main>
    </HydrationBoundary>
  )
}
