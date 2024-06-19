import { proxy } from 'valtio'

export const tabs = [
  { id: 'all-students', title: 'All students' },
  { id: 'add-a-student', title: 'Add a student' },
] as const satisfies { id: string; title: string }[]

type GroupStore = {
  tab: (typeof tabs)[number]['id']
}

export const groupStore = proxy<GroupStore>({
  tab: 'all-students',
})
