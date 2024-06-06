import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { tasksBasesTable } from './tasks/tasks-bases'
import { worksTable } from './works'

export const worksTasksTable = pgTable(
  'works_tasks',
  {
    workId: integer('work_id')
      .notNull()
      .references(() => worksTable.id, { onDelete: 'cascade' }),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasksBasesTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workId, t.taskId] }),
  }),
)

export const worksTasksRelations = relations(worksTasksTable, ({ one }) => ({
  work: one(worksTable, {
    fields: [worksTasksTable.workId],
    references: [worksTable.id],
  }),
  task: one(tasksBasesTable, {
    fields: [worksTasksTable.taskId],
    references: [tasksBasesTable.id],
  }),
}))
