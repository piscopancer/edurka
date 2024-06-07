'use client'

import { signUp } from '@/actions/users'
import { Tooltip } from '@/components/tooltip'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { ComponentProps, useRef } from 'react'
import { TbInfoCircle, TbLoader, TbUser } from 'react-icons/tb'
import { headerStore } from '../../()/header'

export default function SignUp(props: ComponentProps<'div'>) {
  const loginInputRef = useRef<HTMLInputElement>(null!)
  const passwordInputRef = useRef<HTMLInputElement>(null!)
  const emailInputRef = useRef<HTMLInputElement>(null!)
  const nameInputRef = useRef<HTMLInputElement>(null!)
  const surnameInputRef = useRef<HTMLInputElement>(null!)
  const { mutate, isPending } = useMutation({ mutationFn: signUp })

  return (
    <div {...props} className={clsx(props.className, '@container')}>
      <h2 className='mb-6 text-center text-xl'>Sign up</h2>
      <fieldset className='mb-2'>
        <label htmlFor='login' className='block pb-1 text-sm text-zinc-600'>
          Login
        </label>
        <input id='login' ref={loginInputRef} type='text' className='w-full rounded-md bg-zinc-300 px-3 py-2' />
      </fieldset>
      <fieldset className='mb-2'>
        <label htmlFor='password' className='block pb-1 text-sm text-zinc-600'>
          Password
        </label>
        <input
          id='password'
          ref={passwordInputRef}
          type='password'
          className='w-full rounded-md bg-zinc-300 px-3 py-2'
        />
      </fieldset>
      <fieldset className='mb-2'>
        <label htmlFor='email' className='flex items-center pb-1 text-sm text-zinc-600'>
          <span className='mr-1'>Email</span>{' '}
          <Tooltip content='You will receive a confirmation message'>
            <button className='-translate-y-px'>
              <TbInfoCircle />
            </button>
          </Tooltip>
        </label>
        <input
          id='email'
          ref={emailInputRef}
          placeholder='example@gmail.com'
          type='text'
          className='w-full rounded-md bg-zinc-300 px-3 py-2 placeholder:text-zinc-400'
        />
      </fieldset>
      <div className='mb-6'>
        <label className='mb-1 block text-sm text-zinc-600'>Personal details</label>
        <div className='grid grid-cols-[min-content,1fr,1fr] gap-2 @max-md:grid-cols-[1fr]'>
          <TbUser className='size-10 rounded-full bg-zinc-300 stroke-zinc-400 p-2.5 @max-md:hidden' />
          <input
            ref={nameInputRef}
            autoComplete='name'
            placeholder='Name'
            type='text'
            className='w-full rounded-md bg-zinc-300 px-3 py-2 placeholder:text-zinc-400'
          />
          <input
            ref={surnameInputRef}
            autoComplete='name'
            placeholder='Surname'
            type='text'
            className='w-full rounded-md bg-zinc-300 px-3 py-2 placeholder:text-zinc-400'
          />
        </div>
      </div>
      <button
        onClick={() => {
          mutate(
            {
              login: loginInputRef.current.value.trim(),
              password: passwordInputRef.current.value.trim(),
              email: emailInputRef.current.value.trim(),
              name: nameInputRef.current.value.trim(),
              surname: surnameInputRef.current.value.trim(),
            },
            { onSuccess: (data) => console.log(data) },
          )
        }}
        disabled={isPending}
        className='mb-4 flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50'
      >
        {isPending ? <TbLoader className='size-5 animate-spin' /> : 'Continue'}
      </button>
      <button
        onClick={() => {
          headerStore.showUserPopup = true
        }}
        className='mx-auto block rounded-full px-2 text-center text-sm text-zinc-600 hover:text-zinc-900 hover:underline'
      >
        I already have an account
      </button>
    </div>
  )
}
