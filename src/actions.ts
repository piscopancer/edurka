'use server'

import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '../prisma'
import { Token } from './auth'
import { CreateUser } from './user'
import { route } from './utils'

async function _signUpUser(candidate: CreateUser) {
  const salt = bcrypt.genSaltSync(5)
  const hashedPassword = bcrypt.hashSync(candidate.password, salt)
  candidate.password = hashedPassword
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email: candidate.email }, { login: candidate.login }],
    },
  })
  if (existingUser) {
    console.log('Sign up error ocurred')
    return
  }
  await db.user.create({ data: candidate })
  return candidate
}

export async function signUpUser(user: CreateUser) {
  return _signUpUser.bind(null, user)()
}

async function _signInUser(credentials: Pick<CreateUser, 'login' | 'password'>) {
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
    redirect(route('/home'))
    // return dbUser
  }
}

export async function signInUser(credentials: { login: string; password: string }) {
  return _signInUser.bind(null, credentials)()
}

export async function auth(): Promise<User | undefined> {
  const token = cookies().get('auth')?.value
  if (!token) return
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token
    const dbUser = await db.user.findFirst({
      where: {
        id: verifiedToken.id,
      },
    })
    return dbUser ?? undefined
  } catch (error) {
    console.warn(error)
  }
}
