import { auth } from '@/actions/users'
import { hasCookie } from '@/cookies'
import { route } from '@/utils'
import { redirect } from 'next/navigation'
import { TbSearch, TbX } from 'react-icons/tb'
import { queryCreatedGroups, queryParticipatedGroups } from './()'
import Group from './()/group'

export default async function GroupsPage() {
  const authUser = await auth()
  if (!authUser) return
  if (!authUser.confirmed) {
    redirect(route('/confirm/send'))
  }
  const tutorMode = (await hasCookie('tutor')) && authUser.tutor

  const groups = tutorMode ? await queryCreatedGroups(authUser) : await queryParticipatedGroups(authUser)

  return (
    <main className=''>
      <header className='flex h-28 items-center border-b-2 border-zinc-300'>
        <div className='mx-auto flex w-full max-w-screen-xl items-center'>
          <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created groups' : 'My groups'}</h1>
          {tutorMode && <button className='rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>New group</button>}
        </div>
      </header>
      <section className='mx-auto max-w-screen-xl'>
        <search>
          <div className='hopper w-40'>
            <input type='text' className='rounded-full bg-zinc-300 px-12 py-2' />
            <TbSearch className='ml-4 self-center justify-self-start stroke-zinc-500' />
            <button className='mr-2 size-6 self-center justify-self-end rounded-full p-1 text-zinc-500 duration-100 hover:bg-zinc-400/50'>
              <TbX className='size-4' />
            </button>
          </div>
        </search>
        {groups.length ? (
          <ul className='grid grid-cols-4'>
            {groups.map((group) => (
              <li key={group.id}>
                <Group authUser={authUser} group={group} />
              </li>
            ))}
          </ul>
        ) : (
          <div></div>
        )}
      </section>
    </main>
  )
}
