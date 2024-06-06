import { relations } from 'drizzle-orm'
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { coursesTable } from './courses'
import { tasksBasesTable } from './tasks/tasks-bases'
import { usersCoursesParticipationTable } from './users-courses-participation'
import { usersGroupsParticipationTable } from './users-groups-participation'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  login: text('login').notNull().unique(),
  password: text('password').notNull(),
  confirmed: boolean('confirmed').default(false),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  surname: text('surname').notNull(),
  middlename: text('middlename'),
  admin: boolean('admin').default(false),
  tutor: boolean('tutor').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectUser = typeof usersTable.$inferSelect
export type InsertUser = typeof usersTable.$inferInsert

export const usersRelations = relations(usersTable, ({ many }) => ({
  createdGroups: many(usersGroupsParticipationTable),
  participatedCourses: many(usersCoursesParticipationTable),
  createdCourses: many(coursesTable),
  createdTasks: many(tasksBasesTable),
}))
