import { QueryKey } from '@tanstack/react-query'

export const queryKeys = {
  notifications: (userId: number) => ['notifications', userId],
  authUser: ['auth-user'],
  createdCourses: (tutorId: number) => ['created-courses', tutorId],
  participatedCourses: (studentId: number) => ['participated-courses', studentId],
} as const satisfies Record<string, QueryKey | ((...args: any) => QueryKey)>
