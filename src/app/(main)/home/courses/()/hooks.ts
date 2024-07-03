'use client'

import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Course, useCoursesPageUrl } from '.'
import { deleteCourse, queryCreatedCourses, queryParticipatedCourses } from './actions'

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

export function useDeleteCourseMutation(courseId: number) {
  const qc = useQueryClient()
  const { data: authUser } = useAuthUser()

  return useMutation({
    mutationKey: ['delete-course', courseId],
    mutationFn: deleteCourse,
    onMutate({ courseId }) {
      const prev = qc.getQueryData<Course[]>(queryKeys.createdCourses(authUser?.id))
      qc.setQueryData<Course[]>(queryKeys.createdCourses(authUser?.id), (prev) => prev?.filter((c) => c.id !== courseId))
      return { prev }
    },
    onError(err, variables, ctx) {
      console.error(err)
      if (ctx) {
        qc.setQueryData<Course[]>(queryKeys.createdCourses(authUser?.id), ctx.prev)
      }
    },
  })
}
