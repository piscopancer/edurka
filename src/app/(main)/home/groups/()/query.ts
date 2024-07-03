'use client'

import { queryKeys } from '@/query'
import { useAuthUser } from '@/query/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Group, useGroupsPageUrl } from '.'
import { addStudent, createGroup, deleteGroup, excludeStudent, queryCreatedGroups, queryParticipatedGroups, queryStudents } from './server'

export function useCreatedGroups() {
  const authUserQuery = useAuthUser()
  const tutorId = authUserQuery.data?.id
  const url = useGroupsPageUrl()

  return useQuery({
    queryKey: queryKeys.createdGroups(tutorId),
    queryFn: async () => (tutorId ? await queryCreatedGroups(tutorId, url.sp.getAll()) : []),
    enabled: tutorId !== undefined,
  })
}

export function useParticipatedGroups() {
  const authUserQuery = useAuthUser()
  const studentId = authUserQuery.data?.id
  const url = useGroupsPageUrl()

  return useQuery({
    queryKey: queryKeys.participatedGroups(studentId),
    queryFn: async () => (studentId ? await queryParticipatedGroups(studentId, url.sp.getAll()) : []),
    enabled: studentId !== undefined,
  })
}

export function useAddStudentMutation({ groupId, student }: { groupId: number; student: Awaited<ReturnType<typeof queryStudents>>[number] }) {
  const qc = useQueryClient()
  const { data: authUser } = useAuthUser()

  return useMutation({
    mutationKey: ['add-student', groupId, student.id],
    mutationFn: addStudent,
    async onMutate({ groupId }) {
      await qc.invalidateQueries({ queryKey: queryKeys.createdGroups(authUser?.id) })
      const prev = qc.getQueryData<Group[]>(queryKeys.createdGroups(authUser?.id))
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prevGroups) =>
        prevGroups?.map((g) => {
          if (g.id === groupId) {
            g.students.push(student)
          }
          return g
        }),
      )
      return { prev }
    },
    onError(err, props, ctx) {
      if (ctx?.prev) {
        qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), ctx.prev)
        console.log(err)
      }
    },
  })
}

export function useExcludeStudentMutation({ groupId, studentId }: { groupId: number; studentId: number }) {
  const qc = useQueryClient()
  const { data: authUser } = useAuthUser()

  return useMutation({
    mutationKey: ['exclude-student', groupId, studentId],
    mutationFn: excludeStudent,
    async onMutate({ groupId, studentId }) {
      const prev = qc.getQueryData<Group[]>(queryKeys.createdGroups(authUser?.id))
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prevGroups) =>
        prevGroups?.map((g) => ({
          ...g,
          students: g.id === groupId ? g.students.filter((s) => s.id !== studentId) : g.students,
        })),
      )
      return { prev }
    },
    onError(err, props, ctx) {
      if (ctx?.prev) {
        qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), ctx.prev)
        console.log(err)
      }
    },
  })
}

export function useDeleteGroupMutation(groupId: number) {
  const qc = useQueryClient()
  const { data: authUser } = useAuthUser()

  return useMutation({
    mutationKey: ['delete-group', groupId],
    mutationFn: deleteGroup,
    onMutate({ groupId }) {
      const prev = qc.getQueryData<Group[]>(queryKeys.createdGroups(authUser?.id))
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prev) => prev?.filter((g) => g.id !== groupId))
      return { prev }
    },
    onError(err, variables, ctx) {
      console.error(err)
      if (ctx) {
        qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), ctx.prev)
      }
    },
  })
}

export function useStudents(search: string) {
  const { data: authUser } = useAuthUser()

  return useQuery({
    queryKey: ['group-query-students'],
    queryFn: async () => (authUser ? await queryStudents(authUser.id, search) : []),
    enabled: !!authUser,
  })
}

export function useCreateGroupMutation() {
  const qc = useQueryClient()
  const { data: authUser } = useAuthUser()

  return useMutation({
    mutationKey: ['create-group'],
    mutationFn: createGroup,
    onSuccess(group) {
      qc.setQueryData<Group[]>(queryKeys.createdGroups(authUser?.id), (prev) => (prev ? [...prev, group] : [group]))
    },
  })
}
