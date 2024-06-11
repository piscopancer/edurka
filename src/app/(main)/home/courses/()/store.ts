'use client'

import { proxy } from 'valtio'

export const createCourseStore = proxy({
  title: '',
  description: '',
  groupsIds: [] as number[],
  showIncludedGroups: false,
  studentsIds: [] as number[],
  showIncludedStudents: false,
  worksIds: [] as number[],
  showIncludedWorks: false,
})
