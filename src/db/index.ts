import * as answers from '@/db/schema/answers'
import * as questions from '@/db/schema/questions'
import * as users from '@/db/schema/users'
import * as usersQuestionsLikes from '@/db/schema/users-questions-likes'
import * as usersQuestionsViews from '@/db/schema/users-questions-views'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

export const client = createClient({
  url: 'file:./local.db',
})

export const db = drizzle(client, {
  schema: {
    ...users,
    ...questions,
    ...answers,
    ...usersQuestionsLikes,
    ...usersQuestionsViews,
  },
})
