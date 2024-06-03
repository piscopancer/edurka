import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text, type SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { answersTable } from './answers'
import { usersTable } from './users'
import { usersQuestionsLikesTable } from './users-questions-likes'
import { usersQuestionsViewsTable } from './users-questions-views'

export const questionsTable = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  authorId: integer('author_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  // category: text('category', { enum: [...categories] }).notNull(),
  acceptedAnswerId: integer('accepted_answer_id').references((): SQLiteColumn => answersTable.id, { onDelete: 'set null' }),
})

export type TInsertQuestionsTable = typeof questionsTable.$inferInsert
export type TSelectQuestionsTable = typeof questionsTable.$inferSelect

export const questionsRelations = relations(questionsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [questionsTable.authorId],
    references: [usersTable.id],
  }),
  answers: many(answersTable),
  acceptedAnswer: one(answersTable, {
    fields: [questionsTable.acceptedAnswerId],
    references: [answersTable.id],
  }),
  usersLikes: many(usersQuestionsLikesTable),
  usersViews: many(usersQuestionsViewsTable),
}))
