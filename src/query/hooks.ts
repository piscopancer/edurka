import { QueryTestUsersFilter, queryTestUsers } from '@/actions/users'
import { useQuery } from '@tanstack/react-query'

export function useTestUsers(filter: QueryTestUsersFilter) {
  return useQuery({
    queryKey: ['test-users', filter],
    refetchInterval: 2000,
    queryFn: () => queryTestUsers(filter),
    // staleTime: 5000,
  })
}
