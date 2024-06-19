'use client'

import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { useQuery } from '@tanstack/react-query'
import { useGroupsPageUrl } from '.'
import { queryCreatedGroups, queryParticipatedGroups } from './server'

export function useCreatedGroups() {
  const authUserQuery = useAuthUser()
  const tutorId = authUserQuery.data?.id
  const url = useGroupsPageUrl()

  return useQuery({
    queryKey: queryKeys.createdGroups(tutorId),
    queryFn: async () => (tutorId ? await queryCreatedGroups(tutorId, url.sp.getAll()) : []),
    enabled: tutorId !== undefined,
  })
}

export function useParticipatedGroups() {
  const authUserQuery = useAuthUser()
  const studentId = authUserQuery.data?.id
  const url = useGroupsPageUrl()

  return useQuery({
    queryKey: queryKeys.participatedGroups(studentId),
    queryFn: async () => (studentId ? await queryParticipatedGroups(studentId, url.sp.getAll()) : []),
    enabled: studentId !== undefined,
  })
}
