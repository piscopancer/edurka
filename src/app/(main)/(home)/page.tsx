'use client'

import { signInUser, signUpUser } from '@/actions'
import clsx from 'clsx'
import { ComponentProps, useRef } from 'react'

export default function Home() {
  const loginInputRef = useRef<HTMLInputElement>(null!)
  const loginInput2Ref = useRef<HTMLInputElement>(null!)
  const passwordInputRef = useRef<HTMLInputElement>(null!)
  const passwordInput2Ref = useRef<HTMLInputElement>(null!)

  return (
    <main className=''>
      <input ref={loginInputRef} type='text' />
      <input ref={passwordInputRef} type='text' />
      <button
        onClick={async () => {
          const respond = await signUpUser({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value.trim(),
          })
          console.log(respond)
        }}
      >
        sign up
      </button>
      <div>
        <input ref={loginInput2Ref} type='text' />
        <input ref={passwordInput2Ref} type='text' />
        <button
          onClick={async () => {
            const user = await signInUser({
              login: loginInput2Ref.current.value.trim(),
              password: passwordInput2Ref.current.value.trim(),
            })
            return console.log('signed in as: ', user)
          }}
        >
          sign up
        </button>
      </div>
    </main>
  )
}

export function Cross(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(props.className, 'hopper absolute max-h-px max-w-px place-content-center overflow-visible')}
    >
      <div className='h-6 w-px place-self-center bg-zinc-400' />
      <div className='h-px w-6 place-self-center bg-zinc-400' />
    </div>
  )
}
