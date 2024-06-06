import { pgTable, text } from 'drizzle-orm/pg-core'
import { tasksSharedColumns } from '.'

export const selectOneTasksTable = pgTable('select_one_tasks', {
  ...tasksSharedColumns,
  options: text('options').array().notNull(),
  correntAnswer: text('correct_answer').notNull(),
})

export type SelectSelectOneTask = typeof selectOneTasksTable.$inferSelect
export type InsertSelectOneTask = typeof selectOneTasksTable.$inferInsert
