import useUrl from '@/hooks/use-url'
import { Merge } from '@/merge'
import { pageUrlSchema } from '@/types/url'
import { route } from '@/utils'
import { z } from 'zod'
import { queryCreatedGroups, queryParticipatedGroups } from './server'

export type Group = Merge<Awaited<ReturnType<typeof queryCreatedGroups>>, Awaited<ReturnType<typeof queryParticipatedGroups>>>[number]

export const groupsPageUrlSchema = pageUrlSchema({
  searchParamsSchema: {
    search: z.string().min(1),
  },
})

export type GroupsPageFilter = z.infer<typeof groupsPageUrlSchema>['searchParams']

export function useGroupsPageUrl() {
  return useUrl(route('/home/groups'), groupsPageUrlSchema)
}
