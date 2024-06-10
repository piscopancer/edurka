import { route } from './utils'

export type Token = {
  id: number
}

export type AccountConfirmationToken = {
  id: number
  email: string
}

export type AuthUser = Token

export const protectedRoutes = [
  route('/home/courses'),
  route('/home/groups'),
  route('/home/tasks'),
] as const satisfies string[]
