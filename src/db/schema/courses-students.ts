import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { coursesTable } from './courses'
import { usersTable } from './users'

export const coursesStudentsTable = pgTable(
  'courses_students',
  {
    studentId: integer('student_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => coursesTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.courseId] }),
  }),
)

export const coursesStudentsRelations = relations(coursesStudentsTable, ({ one }) => ({
  student: one(usersTable, {
    fields: [coursesStudentsTable.studentId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [coursesStudentsTable.courseId],
    references: [coursesTable.id],
  }),
}))
