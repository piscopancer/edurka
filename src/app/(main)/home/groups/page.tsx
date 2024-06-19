import { queryKeys } from '@/query'
import { getAuthUser, getTutorMode } from '@/query/hooks'
import { qc } from '@/query/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { TbSearch, TbX } from 'react-icons/tb'
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
    queryKey: queryKeys.createdGroups(authUser?.id),
    queryFn: async () => (authUser ? await queryParticipatedGroups(authUser.id, urlParse.data.searchParams) : []),
  })
  const tutorMode = getTutorMode(qc)

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <main className=''>
        <header className='flex h-28 items-center border-b-2 border-zinc-300'>
          <div className='mx-auto flex w-full max-w-screen-xl items-center'>
            <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created groups' : 'My groups'}</h1>
            {tutorMode && <button className='rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New group</button>}
          </div>
        </header>
        <section className='mx-auto max-w-screen-xl'>
          <search>
            <div className='hopper w-40'>
              <input type='text' className='rounded-full bg-zinc-300 px-12 py-2' />
              <TbSearch className='ml-4 self-center justify-self-start stroke-zinc-500' />
              <button className='mr-2 size-6 self-center justify-self-end rounded-full p-1 text-zinc-500 duration-100 hover:bg-zinc-400/50'>
                <TbX className='size-4' />
              </button>
            </div>
          </search>
          <Groups />
        </section>
      </main>
    </HydrationBoundary>
  )
}
