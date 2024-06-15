import { QueryTestUsersFilter, auth, queryNotifications, queryTestUsers } from '@/actions/users'
import { useQuery } from '@tanstack/react-query'

export function useTestUsers(filter: QueryTestUsersFilter) {
  return useQuery({
    queryKey: ['test-users', filter],
    refetchInterval: 1000 * 60,
    queryFn: () => queryTestUsers(filter),
    // staleTime: 1000 * 10,
  })
}

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth-user'],
    refetchInterval: 1000 * 60,
    queryFn: () => auth(),
    staleTime: 1000 * 60,
  })
}

export function useNotifications(userId?: number) {
  return useQuery({
    queryKey: ['notifications', userId],
    refetchInterval: 1000 * 60,
    queryFn: userId ? () => queryNotifications(userId) : () => [],
    staleTime: 1000 * 10,
    enabled: userId !== undefined,
  })
}
