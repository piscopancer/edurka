'use server'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User, users } from './TEMP_DB'

async function _signUpUser(credentials: { login: string; password: string }) {
  const salt = bcrypt.genSaltSync(5)
  const hashedPassword = bcrypt.hashSync(credentials.password, salt)
  // db
  const newUser: User = {
    id: crypto.randomUUID(),
    login: credentials.login,
    password: hashedPassword,
  }
  if (!users.some((u) => u.login === credentials.login)) {
    users.push(newUser)
    console.log('db users: ', users)
    return newUser
  }
}

export async function signUpUser(credentials: { login: string; password: string }) {
  return _signUpUser.bind(null, credentials)()
}

async function _signInUser(credentials: { login: string; password: string }) {
  const dbUser = users.find((u) => u.login === credentials.login)
  if (!dbUser) return
  if (bcrypt.compareSync(credentials.password, dbUser.password)) {
    const token = jwt.sign({ id: dbUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '3d',
    })
    cookies().set('auth', token, {
      httpOnly: true,
      secure: true,
    })
    return dbUser
  }
}

export async function signInUser(credentials: { login: string; password: string }) {
  return _signInUser.bind(null, credentials)()
}
