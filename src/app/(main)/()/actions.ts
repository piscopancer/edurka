'use server'

import { deleteCookie, setCookie } from '@/cookies'

async function _toggleTutor(value: boolean) {
  if (value) {
    await setCookie('tutor', true)
  } else {
    await deleteCookie('tutor')
  }
}

export async function toggleTutor(value: boolean) {
  return _toggleTutor.bind(null, value)()
}
