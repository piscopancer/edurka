import { QueryKey } from '@tanstack/react-query'

export const queryKeys = {
  authUser: ['auth-user'],
  tutorMode: (userId?: number) => ['tutor-mode', userId ?? null],
  notifications: (userId?: number) => ['notifications', userId ?? null],
  createdCourses: (tutorId?: number) => ['created-courses', tutorId ?? null],
  participatedCourses: (studentId?: number) => ['participated-courses', studentId ?? null],
  createdGroups: (tutorId?: number) => ['created-groups', tutorId ?? null],
  participatedGroups: (studentId?: number) => ['participated-groups', studentId ?? null],
} as const satisfies Record<string, QueryKey | ((...args: any) => QueryKey)>
