'use client'

import { useTutorMode } from '@/query/hooks'
import CourseCreator from './course-creator'

export default function Header() {
  const { data: tutorMode } = useTutorMode()

  return (
    <header className='bg-halftone mb-4 flex h-28 items-center border-b'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center max-xl:mx-4'>
        <h1 className='mr-auto text-2xl'>{tutorMode ? 'Created courses' : 'My courses'}</h1>
        {tutorMode && <CourseCreator />}
      </div>
    </header>
  )
}
