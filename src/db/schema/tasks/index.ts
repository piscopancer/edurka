import { integer } from 'drizzle-orm/pg-core'
import { SelectAgreeTask } from './agree-tasks'
import { SelectSelectOneTask } from './select-one-tasks'
import { tasksBasesTable } from './tasks-bases'

export type Tasks = AutoTasks & ManualTasks

export type AutoTasks = {
  agreeTask: SelectAgreeTask
  selectOneTask: SelectSelectOneTask
}

export type ManualTasks = {
  lineTask: any
  miltilineTask: any
}

export const tasksSharedColumns = {
  taskBaseId: integer('task_base_id')
    .primaryKey()
    .references(() => tasksBasesTable.id, { onDelete: 'cascade' }),
}
