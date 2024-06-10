'use server'

import { db } from '#/prisma'
import { Token } from '@/auth'
import { route } from '@/utils'
import { Prisma, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function _signIn(credentials: Pick<Prisma.UserCreateInput, 'login' | 'password'>) {
  const existingUser = await db.user.findFirst({
    where: { login: credentials.login },
  })
  if (!existingUser) return
  if (bcrypt.compareSync(credentials.password, existingUser.password)) {
    const token = jwt.sign(
      {
        id: existingUser.id,
      } satisfies Token,
      process.env.JWT_SECRET!,
      {
        expiresIn: '3d',
      },
    )
    cookies().set('auth', token, {
      httpOnly: true,
      secure: true,
    })
    redirect(route('/home/courses'))
  }
}
export async function signIn(credentials: { login: string; password: string }) {
  return _signIn.bind(null, credentials)()
}

export async function auth(): Promise<User | undefined> {
  const token = cookies().get('auth')?.value
  if (!token) return
  let verifiedToken: Token | undefined = undefined
  try {
    verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token
  } catch (tokenError) {
    console.warn('Token error', tokenError)
  }
  if (!verifiedToken) return undefined
  const dbUser =
    (await db.user.findFirst({
      where: {
        id: verifiedToken.id,
      },
    })) ?? undefined
  return dbUser
}

async function _signOut() {
  cookies().delete('auth')
  redirect(route('/'))
}
export async function signOut() {
  return _signOut.bind(null)()
}

export type QueryTestUsersFilter = Partial<Pick<User, 'name' | 'surname' | 'middlename' | 'tutor'>>

export async function queryTestUsers(filter: QueryTestUsersFilter) {
  return db.user.findMany({
    where: {
      tutor: filter.tutor ? true : undefined,
      name: {
        contains: filter.name || undefined,
        mode: 'insensitive',
      },
    },
  })
}
