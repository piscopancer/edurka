import { $Enums } from '@prisma/client'
import { z } from 'zod'

const TasksSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal($Enums.TaskType.Agree),
    correctAnswer: z.boolean(),
  }),
  z.object({
    type: z.literal($Enums.TaskType.SelectOne),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  }),
  z.object({
    type: z.literal($Enums.TaskType.SelectMany),
    options: z.array(z.string()),
    correctAnswer: z.array(z.string()),
  }),
  z.object({
    type: z.literal($Enums.TaskType.Line),
    // answer is manual: string
  }),
  z.object({
    type: z.literal($Enums.TaskType.Multiline),
    // answer is manual: json
  }),
])

export type Tasks = z.infer<typeof TasksSchema>

export type Task<T extends Tasks['type']> = Tasks & { type: T }
