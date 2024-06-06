import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { usersGroupsParticipationTable } from './users-groups-participation'

export const groupsTable = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tutorId: integer('tutor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectGroup = typeof groupsTable.$inferSelect
export type InsertGroup = typeof groupsTable.$inferInsert

export const groupsUsersRelations = relations(groupsTable, ({ one, many }) => ({
  students: many(usersGroupsParticipationTable),
  tutor: one(usersTable, {
    fields: [groupsTable.tutorId],
    references: [usersTable.id],
  }),
}))
