import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { route } from '@/utils'
import { redirect } from 'next/navigation'

export default async function WorksPage() {
  const authUser = await auth()
  if (!authUser) return
  if (!authUser.confirmed) {
    redirect(route('/confirm/send'))
  }
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  if (!authUser.tutor) {
    redirect(route('/home/courses'))
  }

  return <main className=''></main>
}
