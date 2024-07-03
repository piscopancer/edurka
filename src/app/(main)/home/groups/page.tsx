import { queryKeys } from '@/query'
import { getAuthUser } from '@/query/hooks'
import { qc } from '@/query/server'
import FilterPanel from '../courses/()/filter-panel'
import { groupsPageUrlSchema } from './()'
import Groups from './()/groups'
import Header from './()/header'
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

  return (
    <main className=''>
      <Header />
      <section className='mx-auto max-w-screen-xl'>
        <FilterPanel className='mb-6' />
        <Groups />
      </section>
    </main>
  )
}
