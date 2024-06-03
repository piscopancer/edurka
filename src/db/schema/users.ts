import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { answersTable } from './answers'
import { questionsTable } from './questions'
import { usersQuestionsLikesTable } from './users-questions-likes'
import { usersQuestionsViewsTable } from './users-questions-views'

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  // username: text('username').notNull().$defaultFn(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  imgUrl: text('img_url'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export type TSelectUsersTable = typeof usersTable.$inferSelect

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  questions: many(questionsTable),
  answers: many(answersTable),
  questionsLikes: many(usersQuestionsLikesTable),
  questionsViews: many(usersQuestionsViewsTable),
}))
