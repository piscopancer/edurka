import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { questionsTable } from './questions'
import { usersTable } from './users'

export const usersQuestionsLikesTable = sqliteTable(
  'users_questions_likes',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questionsTable.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.questionId] }),
  })
)

export const usersQuestionsLikesRelations = relations(usersQuestionsLikesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersQuestionsLikesTable.userId],
    references: [usersTable.id],
  }),
  question: one(questionsTable, {
    fields: [usersQuestionsLikesTable.questionId],
    references: [questionsTable.id],
  }),
}))
