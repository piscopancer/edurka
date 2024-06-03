import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { questionsTable } from './questions'
import { usersTable } from './users'

export const usersQuestionsViewsTable = sqliteTable(
  'users_questions_views',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'set null' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questionsTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.questionId] }),
  })
)

export const usersQuestionsViewsRelations = relations(usersQuestionsViewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersQuestionsViewsTable.userId],
    references: [usersTable.id],
  }),
  question: one(questionsTable, {
    fields: [usersQuestionsViewsTable.questionId],
    references: [questionsTable.id],
  }),
}))
