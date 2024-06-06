import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { coursesTable } from './courses'
import { usersTable } from './users'

export const usersCoursesParticipationTable = pgTable(
  'users_courses_participation',
  {
    participantId: integer('participant_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => coursesTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.participantId, t.courseId] }),
  }),
)

export const usersCoursesParticipationRelations = relations(usersCoursesParticipationTable, ({ one }) => ({
  participant: one(usersTable, {
    fields: [usersCoursesParticipationTable.participantId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [usersCoursesParticipationTable.courseId],
    references: [coursesTable.id],
  }),
}))
