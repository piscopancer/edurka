import { QueryTestUsersFilter, auth, queryNotifications, queryTestUsers } from '@/actions/users'
import { AuthUser } from '@/auth'
import { getCookie } from '@/cookies'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { queryKeys } from '.'

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
    queryKey: queryKeys.authUser,
    refetchInterval: 1000 * 60,
    queryFn: () => auth(),
    staleTime: 1000 * 60,
  })
}

export function getAuthUser(qc: QueryClient) {
  return qc.getQueryData<AuthUser>(queryKeys.authUser)
}

export function getTutorMode(qc: QueryClient) {
  const authUser = getAuthUser(qc)
  return qc.getQueryData<AuthUser>(queryKeys.tutorMode(authUser?.id))
}

export function useTutorMode() {
  const authUser = useAuthUser()

  return useQuery({
    queryKey: queryKeys.tutorMode(authUser.data?.id),
    queryFn: async () => (await getCookie('tutor')) && authUser.data?.tutor,
    enabled: !!authUser.data,
  })
}

export function useNotifications() {
  const authUser = useAuthUser()

  return useQuery({
    queryKey: queryKeys.notifications(authUser.data?.id ?? -1),
    refetchInterval: 1000 * 60,
    queryFn: authUser.data && authUser.data.id ? () => queryNotifications(authUser.data!.id) : () => [],
    staleTime: 1000 * 10,
    enabled: authUser.data?.id !== undefined,
  })
}
