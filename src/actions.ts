'use server'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Token } from './auth'
import { db } from './db'
import { InsertUser, SelectUser, usersTable } from './db/schema/users'
import { route } from './utils'

async function _signUpUser(newUser: InsertUser) {
  const salt = bcrypt.genSaltSync(5)
  const hashedPassword = bcrypt.hashSync(newUser.password, salt)
  // db
  newUser.password = hashedPassword
  const dbUser = await db.query.usersTable.findFirst({
    where: (t, { eq, or }) => or(eq(t.email, newUser.email), eq(t.login, newUser.login)),
  })
  if (dbUser) {
    console.log('Sign up error ocurred')
    return
  }
  await db.insert(usersTable).values(newUser)
  return newUser
}

export async function signUpUser(user: InsertUser) {
  return _signUpUser.bind(null, user)()
}

async function _signInUser(credentials: { login: string; password: string }) {
  const dbUser = await db.query.usersTable.findFirst({
    where: (t, { eq }) => eq(t.login, credentials.login),
  })
  if (!dbUser) return
  if (bcrypt.compareSync(credentials.password, dbUser.password)) {
    const token = jwt.sign(
      {
        id: dbUser.id,
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

export async function auth(): Promise<SelectUser | undefined> {
  const token = cookies().get('auth')?.value
  if (!token) return
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token
    const dbUser = await db.query.usersTable.findFirst({
      where: (t, { eq }) => eq(t.id, verifiedToken.id),
    })
    return dbUser
  } catch (error) {
    console.warn(error)
  }
}
