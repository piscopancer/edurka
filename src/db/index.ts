import { dbCredentials } from '#/drizzle.config'
import * as courses from '@/db/schema/courses'
import * as studentsCourses from '@/db/schema/courses-students'
import * as users from '@/db/schema/users'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const client = new Pool(dbCredentials)

export const db = drizzle(client, {
  schema: {
    ...users,
    ...courses,
    ...studentsCourses,
  },
})
