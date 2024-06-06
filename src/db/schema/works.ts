import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { coursesWorksTable } from './courses-works'
import { usersTable } from './users'
import { worksTasksTable } from './works-tasks'

export const worksTable = pgTable('works', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('name'),
  tutorId: integer('tutor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectCourse = typeof worksTable.$inferSelect
export type InsertCourse = typeof worksTable.$inferInsert

export const worksRelations = relations(worksTable, ({ one, many }) => ({
  tutor: one(usersTable, {
    fields: [worksTable.tutorId],
    references: [usersTable.id],
  }),
  tasks: many(worksTasksTable),
  coursesBelongsTo: many(coursesWorksTable),
}))
