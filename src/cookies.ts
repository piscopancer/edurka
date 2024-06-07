'use server'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

type Cookies = {
  tutor: true | undefined
  auth: string | undefined
}

export async function getCookie<N extends keyof Cookies>(name: N) {
  const value = cookies().get(name)?.value
  if (!value) return
  return JSON.parse(value) as Cookies[N]
}

export async function setCookie<N extends keyof Cookies>(
  name: N,
  value: NonNullable<Cookies[N]>,
  options?: Partial<ResponseCookie>,
) {
  cookies().set(name, JSON.stringify(value), { maxAge: 60 * 60 * 24 * 365, ...options })
}

export async function hasCookie<N extends keyof Cookies>(name: N) {
  return !!cookies().get(name)?.value
}

export async function deleteCookie<N extends keyof Cookies>(name: N) {
  cookies().delete(name)
}
