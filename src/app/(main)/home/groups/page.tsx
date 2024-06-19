import { queryKeys } from '@/query'
import { getAuthUser, getTutorMode } from '@/query/hooks'
import { qc } from '@/query/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import FilterPanel from '../courses/()/filter-panel'
import { groupsPageUrlSchema } from './()'
import Groups from './()/groups'
import { queryCreatedGroups, queryParticipatedGroups } from './()/server'

export default async function GroupsPage(url: unknown) {
  const urlParse = groupsPageUrlSchema.safeParse(url)
  if (!urlParse.success) return

  const authUser = getAuthUser(qc)
  await qc.prefetchQuery({
    queryKey: queryKeys.createdGroups(authUser?.id),
    queryFn: async () => (authUser ? await queryCreatedGroups(authUser.id, urlParse.data.searchParams) : []),
  })
  await qc.prefetchQuery({
    queryKey: queryKeys.participatedGroups(authUser?.id),
    queryFn: async () => (authUser ? await queryParticipatedGroups(authUser.id, urlParse.data.searchParams) : []),
  })
  const tutorMode = getTutorMode(qc)

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <main className=''>
        <header className='bg-halftone mb-4 flex h-28 items-center border-b'>
          <div className='mx-auto flex w-full max-w-screen-xl items-center'>
            <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created groups' : 'My groups'}</h1>
            {tutorMode && <button className='rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New group</button>}
          </div>
        </header>
        <section className='mx-auto max-w-screen-xl'>
          <FilterPanel className='mb-6' />
          <Groups />
        </section>
      </main>
    </HydrationBoundary>
  )
}
