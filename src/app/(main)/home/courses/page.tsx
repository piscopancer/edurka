import { queryKeys } from '@/query'
import { getAuthUser, getTutorMode } from '@/query/hooks'
import { qc } from '@/query/server'
import { coursesPageUrlSchema } from './()'
import { queryCreatedCourses, queryParticipatedCourses } from './()/actions'
import Courses from './()/courses'
import FilterPanel from './()/filter-panel'
import Header from './()/header'

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
    <main>
      <Header />
      <FilterPanel className='mx-auto mb-6 max-w-screen-xl max-xl:mx-4' />
      <Courses className='mx-auto max-w-screen-xl max-xl:mx-4' />
    </main>
  )
}
