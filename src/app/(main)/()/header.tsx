'use client'

import { signIn, signOut } from '@/actions/users'
import { User } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ComponentProps, useRef } from 'react'
import { TbFlag, TbLoader, TbLogout, TbSchool, TbSelector } from 'react-icons/tb'
import { proxy, useSnapshot } from 'valtio'
import { toggleTutor } from './actions'

export const headerStore = proxy({
  showUserPopup: false,
  showTutorPopup: false,
})

export default function Header({
  user,
  tutorMode,
  ...props
}: ComponentProps<'header'> & { user: User | undefined; tutorMode: boolean }) {
  const path = usePathname()
  const signOutMutation = useMutation({ mutationFn: signOut })
  const headerSnap = useSnapshot(headerStore)
  const toggleTutorMutation = useMutation({ mutationFn: toggleTutor })
  const router = useRouter()

  return (
    <header
      {...props}
      className={clsx(
        props.className,
        'sticky top-0 z-[1] flex items-center border-b-2 border-zinc-300 bg-zinc-200 px-6 py-4',
      )}
    >
      <nav className='mr-auto'>
        <Link href={'/'} className='text-zinc-500 duration-100 hover:text-zinc-800'>
          <TbSchool className='size-6' />
        </Link>
      </nav>
      {user && path === '/' && (
        <Link href={'/home/courses'} className='rounded-full px-4 py-1 hover:bg-zinc-300'>
          На главную
        </Link>
      )}
      {user?.tutor && (
        <button
          disabled={toggleTutorMutation.isPending}
          onClick={async () => {
            await toggleTutorMutation.mutateAsync(!tutorMode)
            router.refresh()
          }}
          className='flex items-center gap-x-2 rounded-full bg-zinc-300 py-1 pl-4 pr-3 duration-100 disabled:opacity-50'
        >
          {tutorMode ? 'Tutor' : 'Student'}
          {toggleTutorMutation.isPending ? <TbLoader className='animate-spin' /> : <TbSelector />}
        </button>
      )}
      <Popover.Root onOpenChange={(open) => (headerStore.showUserPopup = open)} open={headerSnap.showUserPopup}>
        <Popover.Content
          sideOffset={8}
          align='end'
          className='w-64 rounded-xl border-2 border-zinc-400 bg-zinc-200 shadow'
        >
          {user ? (
            <menu className='py-2'>
              <Link
                href={'/'}
                onClick={() => {
                  headerStore.showUserPopup = false
                }}
                className='flex w-full items-center px-4 py-2 hover:bg-zinc-300'
              >
                <span className='mr-auto line-clamp-1 max-w-fit'>Welcome page</span>
                <TbFlag className='size-5' />
              </Link>
              <button
                disabled={signOutMutation.isPending}
                onClick={() => {
                  headerStore.showUserPopup = false
                  signOutMutation.mutateAsync()
                }}
                className='flex w-full items-center px-4 py-2 hover:bg-zinc-300 disabled:opacity-50'
              >
                <span className='mr-auto'>Log out</span>
                <TbLogout className='size-5' />
              </button>
            </menu>
          ) : (
            <LoginForm />
          )}
          <Popover.Arrow className='w-4 fill-zinc-400' />
        </Popover.Content>
        <Popover.Trigger className='rounded-full px-4 py-1 hover:bg-zinc-300'>
          {' '}
          {user ? user.login : 'Log in'}
        </Popover.Trigger>
      </Popover.Root>
    </header>
  )
}

function LoginForm(props: ComponentProps<'article'>) {
  const loginInputRef = useRef<HTMLInputElement>(null!)
  const passwordInputRef = useRef<HTMLInputElement>(null!)
  const signInMutation = useMutation({ mutationFn: signIn })

  return (
    <article {...props} className={clsx(props.className, 'p-4')}>
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Login</label>
        <input ref={loginInputRef} type='text' className='w-full rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      <fieldset className=''>
        <label className='mb-1 block text-sm text-zinc-600'>Password</label>
        <input ref={passwordInputRef} type='password' className='w-full rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      <button className='mb-4 rounded-full text-xs text-zinc-600 hover:text-zinc-900 hover:underline'>
        I forgot my password
      </button>
      <button
        disabled={signInMutation.isPending}
        onClick={() => {
          headerStore.showUserPopup = false
          signInMutation.mutate({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value.trim(),
          })
        }}
        className='mb-4 flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50'
      >
        {signInMutation.isPending ? <TbLoader className='size-5 animate-spin' /> : 'Continue'}
      </button>
      <button
        onClick={() => {
          headerStore.showUserPopup = false
          document.getElementById('sign-up')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className='mx-auto block rounded-full px-2 text-center text-xs text-zinc-600 hover:text-zinc-900 hover:underline'
      >
        Sign up
      </button>
    </article>
  )
}
