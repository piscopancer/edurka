'use client'

import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { useQuery } from '@tanstack/react-query'
import { useCoursesPageUrl } from '.'
import { queryCreatedCourses, queryParticipatedCourses } from './actions'

export function useCreatedCourses() {
  const authUserQuery = useAuthUser()
  const tutorId = authUserQuery.data?.id
  const url = useCoursesPageUrl()

  return useQuery({
    queryKey: queryKeys.createdCourses(tutorId),
    queryFn: async () => (tutorId ? await queryCreatedCourses(tutorId, url.sp.getAll()) : []),
    enabled: tutorId !== undefined,
  })
}

export function useParticipatedCourses() {
  const authUserQuery = useAuthUser()
  const studentId = authUserQuery.data?.id
  const url = useCoursesPageUrl()

  return useQuery({
    queryKey: queryKeys.participatedCourses(studentId),
    queryFn: async () => (studentId ? await queryParticipatedCourses(studentId, url.sp.getAll()) : []),
    enabled: studentId !== undefined,
  })
}