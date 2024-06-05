import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { groupsTable } from './groups'
import { usersTable } from './users'

export const groupsStudentsTable = pgTable(
  'groups_students',
  {
    groupId: integer('group_id')
      .notNull()
      .references(() => groupsTable.id, { onDelete: 'cascade' }),
    studentId: integer('student_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.studentId] }),
  }),
)

export const groupsStudentsRelations = relations(groupsStudentsTable, ({ one }) => ({
  student: one(usersTable, {
    fields: [groupsStudentsTable.studentId],
    references: [usersTable.id],
  }),
  course: one(groupsTable, {
    fields: [groupsStudentsTable.groupId],
    references: [groupsTable.id],
  }),
}))
