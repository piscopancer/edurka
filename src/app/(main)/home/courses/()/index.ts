import useUrl from '@/hooks/use-url'
import { Merge } from '@/merge'
import { pageUrlSchema } from '@/types/url'
import { objectEntries, route } from '@/utils'
import { Prisma } from '@prisma/client'
import { IconType } from 'react-icons/lib'
import { TbArrowDown, TbArrowUp, TbClockDown, TbClockUp } from 'react-icons/tb'
import { z } from 'zod'
import { queryCreatedCourses, queryParticipatedCourses } from './actions'

const sortingSchema = z.enum(['createdAt', 'works', 'students'])
const orderSchema = z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc])
type Sortings = z.infer<typeof sortingSchema>
type Orders = z.infer<typeof orderSchema>
export const defaultOrder = 'desc' satisfies z.infer<typeof orderSchema>
export const defaultSorting = 'createdAt' satisfies z.infer<typeof sortingSchema>

export type CoursesPageFilters = z.infer<typeof coursesPageUrlSchema>['searchParams']

export const coursesPageUrlSchema = pageUrlSchema({
  searchParamsSchema: {
    search: z.string().min(1),
    sorting: sortingSchema.catch(defaultSorting),
    order: orderSchema.catch(defaultOrder),
    hideCompletedWorks: z.boolean(),
  },
})

export function useCoursesPageUrl() {
  return useUrl(route('/home/courses'), coursesPageUrlSchema)
}

export type Course = Merge<Awaited<ReturnType<typeof queryCreatedCourses>>, Awaited<ReturnType<typeof queryParticipatedCourses>>>[number]

type SortingOption = {
  title: string
  orders: Record<
    NonNullable<z.infer<typeof orderSchema>>,
    {
      icon: IconType
      description: string
    }
  >
}

type SortingOptions = Record<NonNullable<z.infer<typeof sortingSchema>>, SortingOption>

export const sortingOptions = {
  createdAt: {
    title: 'Creation Date',
    orders: {
      desc: { icon: TbClockDown, description: 'Newer first' },
      asc: { icon: TbClockUp, description: 'Older first' },
    },
  },
  works: {
    title: 'Works',
    orders: {
      desc: { icon: TbArrowDown, description: 'With more works first' },
      asc: { icon: TbArrowUp, description: 'With fewer works first' },
    },
  },
  students: {
    title: 'Students',
    orders: {
      desc: { icon: TbArrowDown, description: 'With more students first' },
      asc: { icon: TbArrowUp, description: 'With fewer students first' },
    },
  },
} satisfies SortingOptions

export function getFilteredSortingOptions(tutorMode: boolean) {
  return objectEntries(sortingOptions).filter(([s]) =>
    (tutorMode ? (['createdAt', 'students', 'works'] satisfies Sortings[]) : (['createdAt', 'works'] satisfies Sortings[])).includes(s),
  )
}
