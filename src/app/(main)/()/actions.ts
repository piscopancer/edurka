'use server'

import { deleteCookie, setCookie } from '@/cookies'

export async function toggleTutor(value: boolean) {
  if (value) {
    await setCookie('tutor', true)
    return true
  } else {
    await deleteCookie('tutor')
    return false
  }
}
