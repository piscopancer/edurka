import { Merge } from '@/merge'
import { pagePathSchema } from '@/types/path'
import { Prisma } from '@prisma/client'
import { IconType } from 'react-icons/lib'
import { TbArrowDown, TbArrowUp, TbClockDown, TbClockUp } from 'react-icons/tb'
import { z } from 'zod'
import { queryCreatedCourses, queryParticipatedCourses } from './actions'

const sortingSchema = z.enum(['createdAt', 'completion'])
const orderSchema = z.enum([Prisma.SortOrder.asc, Prisma.SortOrder.desc])
export const defaultOrder: z.infer<typeof orderSchema> = 'desc'
export const defaultSorting: z.infer<typeof sortingSchema> = 'createdAt'

export const coursesPagePathSchema = pagePathSchema({
  searchParamsSchema: {
    search: z.string().min(1),
    sorting: sortingSchema.catch(defaultSorting),
    order: orderSchema.catch(defaultOrder),
    hideCompletedWorks: z.boolean(),
  },
})

export type Course = Merge<Awaited<ReturnType<typeof queryCreatedCourses>>, Awaited<ReturnType<typeof queryParticipatedCourses>>>[number]

type SortingOptions = Record<
  NonNullable<z.infer<typeof sortingSchema>>,
  {
    title: string
    orders: Record<
      NonNullable<z.infer<typeof orderSchema>>,
      {
        icon: IconType
        description: string
      }
    >
  }
>

export function getSortingOptions(/* tutorMode */) {
  return {
    createdAt: {
      title: 'Дата создания',
      orders: {
        desc: { icon: TbClockDown, description: 'Сначала новые' },
        asc: { icon: TbClockUp, description: 'Сначала старые' },
      },
    },
    completion: {
      title: 'Выполнение',
      orders: {
        desc: { icon: TbArrowDown, description: 'Сначала с большим выполнением' },
        asc: { icon: TbArrowUp, description: 'Сначала с меньшим выполнением' },
      },
    },
  } satisfies SortingOptions
}
