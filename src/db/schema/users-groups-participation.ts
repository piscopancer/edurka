import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { groupsTable } from './groups'
import { usersTable } from './users'

export const usersGroupsParticipationTable = pgTable(
  'users_groups_participation',
  {
    participantId: integer('participant_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    groupId: integer('group_id')
      .notNull()
      .references(() => groupsTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.participantId] }),
  }),
)

export const usersGroupsParticipationRelations = relations(usersGroupsParticipationTable, ({ one }) => ({
  participant: one(usersTable, {
    fields: [usersGroupsParticipationTable.participantId],
    references: [usersTable.id],
  }),
  group: one(groupsTable, {
    fields: [usersGroupsParticipationTable.groupId],
    references: [groupsTable.id],
  }),
}))
