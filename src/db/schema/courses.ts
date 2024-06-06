import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { usersCoursesParticipationTable } from './users-courses-participation'

export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tutorId: integer('tutor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectCourse = typeof coursesTable.$inferSelect
export type InsertCourse = typeof coursesTable.$inferInsert

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  students: many(usersCoursesParticipationTable),
  tutor: one(usersTable, {
    fields: [coursesTable.tutorId],
    references: [usersTable.id],
  }),
}))
