import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { coursesStudentsTable } from './courses-students'
import { usersTable } from './users'

export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('name'),
  tutorId: integer('tutor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectCourse = typeof coursesTable.$inferSelect
export type InsertCourse = typeof coursesTable.$inferInsert

export const coursesUsersRelations = relations(coursesTable, ({ one, many }) => ({
  students: many(coursesStudentsTable),
  tutor: one(usersTable, {
    fields: [coursesTable.tutorId],
    references: [usersTable.id],
  }),
}))
