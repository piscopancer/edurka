import SearchParamLink from '@/components/search-param-link'
import { pageUrlSchema } from '@/types/url'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { queryCourse, updateCourse } from './server'

export const coursePageUrlSchema = pageUrlSchema({
  paramsSchema: {
    id: z.number({ coerce: true }).positive(),
  },
  searchParamsSchema: {
    tab: z.union([z.literal('description'), z.literal('works'), z.literal('settings')]).catch('description'),
  },
})

export const CoursePageSearchParamLink = SearchParamLink<typeof coursePageUrlSchema>

export type Tab = NonNullable<Zod.infer<typeof coursePageUrlSchema>['searchParams']['tab']>

export type Course = NonNullable<Awaited<ReturnType<typeof queryCourse>>>

export const courseQueryKeys = {
  course: (id: number) => ['course', id] as const,
}

export function useCourseQuery(id: number) {
  return useQuery({
    queryKey: courseQueryKeys.course(id),
    queryFn: async () => await queryCourse(id),
  })
}

export function useUpdateCourseMutation(id: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateCourse,
    onMutate({ id, ...updateData }) {
      const prev = qc.getQueryData<Course>(courseQueryKeys.course(id))
      qc.setQueryData<Course>(courseQueryKeys.course(id), (prev): Course | undefined => {
        if (!prev) return
        return {
          ...prev,
          ...(updateData.title ? { title: updateData.title } : {}),
          ...(updateData.description ? { description: updateData.description } : {}),
          ...(updateData.worksToDisconnectIds ? { works: prev.works.filter(({ id }) => !updateData.worksToDisconnectIds!.includes(id)) } : {}),
        }
      })
      return { prev }
    },
    onError(error, variables, context) {
      console.log('err', error)
    },
    onSuccess(data, variables, context) {
      console.log('suc', variables.title)
    },
  })
}
