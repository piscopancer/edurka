'use client'

import { signInUser } from '@/actions'
import { User } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, useRef } from 'react'

export default function Header({ user, ...props }: ComponentProps<'header'> & { user: User | undefined }) {
  return (
    <header {...props} className={clsx(props.className, 'flex items-center px-6 py-4')}>
      <nav className='mr-auto'>
        <Link href={'/'}>Edurka</Link>
      </nav>
      <Popover.Root>
        <Popover.Content sideOffset={8} align='end'>
          {user ? <></> : <LoginForm />}
          <Popover.Arrow />
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

  return (
    <article
      {...props}
      className={clsx(props.className, 'w-64 rounded-xl border-2 border-zinc-900 bg-zinc-200 p-4 shadow')}
    >
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Login</label>
        <input ref={loginInputRef} type='text' className='w-full rounded-md bg-zinc-300 px-2 py-1' />
      </fieldset>
      <fieldset className=''>
        <label className='mb-1 block text-sm text-zinc-600'>Password</label>
        <input ref={passwordInputRef} type='password' className='w-full rounded-md bg-zinc-300 px-2 py-1' />
      </fieldset>
      <button className='mb-4 rounded-full text-xs text-zinc-600 hover:text-zinc-900 hover:underline'>
        I forgot my password
      </button>
      <button
        onClick={async () => {
          await signInUser({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value.trim(),
          })
        }}
        className='mb-4 w-full rounded-md bg-zinc-900 py-1 text-center font-mono text-zinc-200 hover:bg-zinc-800'
      >
        {'->'}
      </button>
      <button className='mx-auto block rounded-full px-2 text-center text-xs text-zinc-600 hover:text-zinc-900 hover:underline'>
        Sign up
      </button>
    </article>
  )
}
