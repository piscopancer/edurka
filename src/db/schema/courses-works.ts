import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { coursesTable } from './courses'
import { worksTable } from './works'

export const coursesWorksTable = pgTable(
  'courses_works',
  {
    courseId: integer('course_id')
      .notNull()
      .references(() => coursesTable.id, { onDelete: 'cascade' }),
    workId: integer('work_id')
      .notNull()
      .references(() => worksTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.workId] }),
  }),
)

export const worksTasksRelations = relations(coursesWorksTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [coursesWorksTable.courseId],
    references: [coursesTable.id],
  }),
  work: one(worksTable, {
    fields: [coursesWorksTable.workId],
    references: [worksTable.id],
  }),
}))
