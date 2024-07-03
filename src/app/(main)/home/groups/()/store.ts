import { proxy } from 'valtio'

export const tabs = [
  { id: 'all-students', title: 'All students' },
  { id: 'add-students', title: 'Add students' },
] as const satisfies { id: string; title: string }[]

type GroupStore = {
  tab: (typeof tabs)[number]['id']
  search: string
}

export const groupStore = proxy<GroupStore>({
  tab: 'all-students',
  search: '',
})

export const groupCreatorStore = proxy<{ title: string; studentsSearch: string; studentsIds: number[] }>({
  title: '',
  studentsSearch: '',
  studentsIds: [],
})
