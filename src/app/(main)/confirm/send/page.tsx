import { auth } from '@/actions/users'
import { route } from '@/utils'
import { redirect } from 'next/navigation'
import { TbMailForward } from 'react-icons/tb'
import SendButton from './()/send-button'

export default async function SendCofirmationPage() {
  const authUser = await auth()

  if (!authUser || authUser.confirmed) {
    redirect(route('/'))
  }

  return (
    <article className='mx-auto mt-[15vh] w-fit text-center'>
      <TbMailForward className='mb-6 inline-block size-32 rounded-full bg-accent/10 stroke-accent p-8' />
      <h1 className='mb-2 text-lg font-medium'>Confirm your email</h1>
      <h2 className='mb-2'>Before you go, please confirm that email address belongs to you</h2>
      <p className='mb-4 text-sm'>
        Your email is <span className='bg-zinc-300 font-mono font-medium'>{authUser.email}</span>
      </p>
      <SendButton user={authUser} className='mx-auto' />
    </article>
  )
}
