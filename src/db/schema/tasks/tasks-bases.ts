import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from '../users'
import { worksTasksTable } from '../works-tasks'

export const tasksBasesTable = pgTable('tasks_bases', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  description: text('description'),
  tutorId: integer('tutor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const tasksBasesRelations = relations(tasksBasesTable, ({ many, one }) => ({
  works: many(worksTasksTable),
  tutor: one(usersTable, {
    fields: [tasksBasesTable.tutorId],
    references: [usersTable.id],
  }),
}))
