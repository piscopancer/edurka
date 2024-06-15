'use server'

import { db } from '#/prisma'
import { AuthUser, Token } from '@/auth'
import { getSharedNotificationsFindManyArgs } from '@/notifications'
import { route } from '@/utils'
import { $Enums, Prisma, User } from '@prisma/client'
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

export async function auth(): Promise<AuthUser | null> {
  const token = cookies().get('auth')?.value
  if (!token) return null
  let verifiedToken: Token | undefined = undefined
  try {
    verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token
  } catch (tokenError) {
    console.warn('Token error', tokenError)
  }
  if (!verifiedToken) return null
  const dbUser =
    (await db.user.findFirst({
      where: {
        id: verifiedToken.id,
      },
      select: {
        id: true,
        createdAt: true,
        email: true,
        confirmed: true,
        name: true,
        surname: true,
        middlename: true,
        tutor: true,
        admin: true,
      },
    })) ?? undefined
  return dbUser ?? null
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

export async function queryNotifications(receiverId: number) {
  const { where, include } = getSharedNotificationsFindManyArgs(receiverId)
  const notifications = await db.$transaction(async (tx) => {
    const addedToCourseNotifications = await tx.addedToCourseNotification.findMany({
      where,
      include: {
        ...include,
        course: true,
      },
    })
    const addedToGroupNotifications = await tx.addedToGroupNotification.findMany({
      where,
      include: {
        ...include,
        group: {
          include: {
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    })
    return [
      addedToCourseNotifications.map((ntf) => ({ ...ntf, type: $Enums.NotificationType.AddedToCourseNotification })),
      addedToGroupNotifications.map((ntf) => ({ ...ntf, type: $Enums.NotificationType.AddedToGroupNotification })),
    ]
  })
  return notifications.flat()
}
