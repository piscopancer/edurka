'use client'

import { proxy } from 'valtio'
import { findParticipants, findWorks } from './actions'

export const createCourseStore = proxy({
  title: '',
  description: '',
  participantsSearch: '',
  includedWorks: [] as Awaited<ReturnType<typeof findWorks>>,
  showIncludedWorks: false,
  includedGroups: [] as Awaited<ReturnType<typeof findParticipants>>['groups'],
  showIncludedGroups: false,
  includedStudents: [] as Awaited<ReturnType<typeof findParticipants>>['students'],
  showIncludedStudents: false,
})
