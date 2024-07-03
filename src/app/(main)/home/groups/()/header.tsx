'use client'

import { useTutorMode } from '@/query/hooks'
import GroupCreator from './group-creator'

export default function Header() {
  const { data: tutorMode } = useTutorMode()

  return (
    <header className='bg-halftone mb-4 flex h-28 items-center border-b'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center'>
        <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created groups' : 'My groups'}</h1>
        {tutorMode && <GroupCreator />}
      </div>
    </header>
  )
}
