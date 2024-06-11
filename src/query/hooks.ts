import { QueryTestUsersFilter, queryTestUsers } from '@/actions/users'
import { useQuery } from '@tanstack/react-query'

export function useTestUsers(filter: QueryTestUsersFilter) {
  return useQuery({
    queryKey: ['test-users', filter],
    refetchInterval: 1000 * 60,
    queryFn: () => queryTestUsers(filter),
    staleTime: 1000 * 10,
  })
}
