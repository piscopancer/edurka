import { boolean, pgTable } from 'drizzle-orm/pg-core'
import { tasksSharedColumns } from '.'

export const agreeTasksTable = pgTable('agree_tasks', {
  ...tasksSharedColumns,
  correntAnswer: boolean('correct_answer').notNull(),
})

export type SelectAgreeTask = typeof agreeTasksTable.$inferSelect
export type InsertAgreeTask = typeof agreeTasksTable.$inferInsert
