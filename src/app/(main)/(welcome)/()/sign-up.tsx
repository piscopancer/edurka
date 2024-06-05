'use client'

import { signUpUser } from '@/actions'
import clsx from 'clsx'
import { ComponentProps, useRef } from 'react'

export default function SignUp(props: ComponentProps<'div'>) {
  const loginInputRef = useRef<HTMLInputElement>(null!)
  const passwordInputRef = useRef<HTMLInputElement>(null!)
  const emailInputRef = useRef<HTMLInputElement>(null!)
  const nameInputRef = useRef<HTMLInputElement>(null!)
  const surnameInputRef = useRef<HTMLInputElement>(null!)

  return (
    <div {...props} className={clsx(props.className, 'w-64')}>
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Login</label>
        <input ref={loginInputRef} type='text' className='w-full rounded-md bg-zinc-300 px-2 py-1' />
      </fieldset>
      <fieldset className=''>
        <label className='mb-1 block text-sm text-zinc-600'>Password</label>
        <input ref={passwordInputRef} type='password' className='w-full rounded-md bg-zinc-300 px-2 py-1' />
      </fieldset>
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Email</label>
        <input
          ref={emailInputRef}
          placeholder='example@gmail.com'
          type='text'
          className='w-full rounded-md bg-zinc-300 px-2 py-1 placeholder:text-zinc-400'
        />
      </fieldset>
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Name</label>
        <input
          ref={nameInputRef}
          autoComplete='name'
          type='text'
          className='w-full rounded-md bg-zinc-300 px-2 py-1 placeholder:text-zinc-400'
        />
      </fieldset>
      <fieldset className='mb-2'>
        <label className='mb-1 block text-sm text-zinc-600'>Surname</label>
        <input
          ref={surnameInputRef}
          type='text'
          autoComplete='family-name'
          className='w-full rounded-md bg-zinc-300 px-2 py-1 placeholder:text-zinc-400'
        />
      </fieldset>
      <button
        onClick={async () => {
          const newUser = await signUpUser({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value.trim(),
            email: emailInputRef.current.value.trim(),
            name: nameInputRef.current.value.trim(),
            surname: surnameInputRef.current.value.trim(),
          })
          console.log('user inserted', newUser)
        }}
        className='mb-4 w-full rounded-md bg-zinc-900 py-1 text-center font-mono text-zinc-200 hover:bg-zinc-800'
      >
        {'->'}
      </button>
      <button className='mx-auto block rounded-full px-2 text-center text-xs text-zinc-600 hover:text-zinc-900 hover:underline'>
        Log in
      </button>
    </div>
  )
}
