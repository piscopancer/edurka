'use client'

import { queryKeys } from '@/query'
import { useQuery } from '@tanstack/react-query'
import { queryCreatedCourses, queryParticipatedCourses } from './actions'

export function useCreatedCourses(tutorId?: number) {
  return useQuery({
    queryKey: queryKeys.createdCourses(tutorId ?? -1),
    queryFn: () => queryCreatedCourses(tutorId ?? -1),
    enabled: tutorId !== undefined,
  })
}

export function useParticipatedCourses(studentId?: number) {
  return useQuery({
    queryKey: queryKeys.participatedCourses(studentId ?? -1),
    queryFn: () => queryParticipatedCourses(studentId ?? -1),
    enabled: studentId !== undefined,
  })
}
