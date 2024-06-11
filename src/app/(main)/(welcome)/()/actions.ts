'use server'

import { db } from '#/prisma'
import { Result } from '@/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

export type SignUpResult = Result<
  {
    id: number
  },
  [['failed', { message: string }]]
>

async function _signUp(candidate: Prisma.UserCreateInput): Promise<SignUpResult> {
  const salt = bcrypt.genSaltSync(5)
  const hashedPassword = bcrypt.hashSync(candidate.password, salt)
  candidate.password = hashedPassword
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email: candidate.email }, { login: candidate.login }],
    },
  })
  if (existingUser) {
    return {
      success: false,
      error: { code: 'failed', message: 'Failed creating a user' },
    }
  }
  const createdUser = await db.user.create({ data: candidate, select: { id: true } })
  return {
    success: true,
    id: createdUser.id,
  }
}
export async function signUp(user: Prisma.UserCreateInput) {
  return _signUp.bind(null, user)()
}