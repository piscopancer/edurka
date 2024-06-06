import { dbCredentials } from '#/drizzle.config'
import * as courses from '@/db/schema/courses'
import * as coursesWorks from '@/db/schema/courses-works'
import * as agreeTasks from '@/db/schema/tasks/agree-tasks'
import * as selectOneTasks from '@/db/schema/tasks/select-one-tasks'
import * as tasksBases from '@/db/schema/tasks/tasks-bases'
import * as users from '@/db/schema/users'
import * as studentsCourses from '@/db/schema/users-courses-participation'
import * as works from '@/db/schema/works'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const client = new Pool(dbCredentials)

export const db = drizzle(client, {
  schema: {
    ...users,
    ...courses,
    ...coursesWorks,
    ...studentsCourses,
    ...works,
    ...tasksBases,
    ...agreeTasks,
    ...selectOneTasks,
  },
})
