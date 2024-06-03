import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { questionsTable } from './questions'
import { usersTable } from './users'

export const answersTable = sqliteTable('answers', {
  id: integer('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  questionId: integer('question_id')
    .notNull()
    .references(() => questionsTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  useless: integer('useless', { mode: 'boolean' }).default(false),
})

export const answersRelations = relations(answersTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [answersTable.authorId],
    references: [usersTable.id],
  }),
  question: one(questionsTable, {
    fields: [answersTable.questionId],
    references: [questionsTable.id],
  }),
}))
