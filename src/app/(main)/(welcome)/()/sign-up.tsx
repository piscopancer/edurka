'use client'

import { signIn } from '@/actions/users'
import { Tooltip } from '@/components/tooltip'
import { Error, ObjectSchema } from '@/utils'
import { Prisma } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { ComponentProps, useRef, useState } from 'react'
import { TbEye, TbEyeOff, TbInfoCircle, TbLoader, TbUser } from 'react-icons/tb'
import { typeToFlattenedError, z } from 'zod'
import { headerStore } from '../../()/client'
import { SignUpResult, signUp } from './actions'

const minLoginLength = 4
const minPasswordLength = 4

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  login: z.string().trim().min(minLoginLength, `Login must be longer than ${minLoginLength} characters`).regex(/^\S*$/, 'Login must not include whitespaces'),
  name: z.string().min(2, 'Name too short'),
  surname: z.string().min(2, 'Surname too short'),
  password: z.string().min(minPasswordLength, `Password must be longer than ${minPasswordLength} characters`).regex(/^\S*$/, 'Password must not include whitespaces'),
}) satisfies ObjectSchema<Prisma.UserCreateInput>

type Errors = typeToFlattenedError<typeof createUserSchema._type>['fieldErrors']

export default function SignUp(props: ComponentProps<'div'>) {
  const loginInputRef = useRef<HTMLInputElement>(null!)
  const passwordInputRef = useRef<HTMLInputElement>(null!)
  const emailInputRef = useRef<HTMLInputElement>(null!)
  const nameInputRef = useRef<HTMLInputElement>(null!)
  const surnameInputRef = useRef<HTMLInputElement>(null!)
  const signUpMutation = useMutation({ mutationFn: signUp })
  const signInMutation = useMutation({ mutationFn: signIn })
  const router = useRouter()
  const [signUpError, setSignUpError] = useState<Error<SignUpResult> | undefined>(undefined)
  const [parseErrors, setParseErrors] = useState<Errors | undefined>(undefined)
  const [revealPassword, setRevealPassword] = useState(false)
  const RevealPasswordIcon = revealPassword ? TbEye : TbEyeOff

  return (
    <div {...props} className={clsx(props.className, '@container')}>
      <h2 className='mb-6 text-center text-xl'>Sign up</h2>
      <fieldset className='mb-2'>
        <label htmlFor='login' className='block pb-1 text-sm'>
          Login
        </label>
        <input
          id='login'
          ref={loginInputRef}
          type='text'
          className={clsx('w-full rounded-lg border px-3 py-2 shadow not-[:last-child]:mb-1', parseErrors?.login?.length && 'outline-rose-400')}
        />
        {parseErrors?.login?.length && <Errors field={parseErrors.login} />}
      </fieldset>
      <fieldset className='mb-2'>
        <label htmlFor='password' className='block pb-1 text-sm'>
          Password
        </label>
        <div className='hopper not-[:last-child]:mb-1'>
          <button onClick={() => setRevealPassword((prev) => !prev)} className='relative flex aspect-square items-center justify-center self-stretch justify-self-end pr-2'>
            <RevealPasswordIcon className='size-5' />
          </button>
          <input
            id='password'
            ref={passwordInputRef}
            type={revealPassword ? 'text' : 'password'}
            className={clsx('w-full rounded-lg border px-3 py-2 shadow not-[:last-child]:mb-1', parseErrors?.password?.length && 'outline-rose-400')}
          />
        </div>
        {parseErrors?.password?.length && <Errors field={parseErrors.password} />}
      </fieldset>
      <fieldset className='mb-2'>
        <label htmlFor='email' className='flex items-center pb-1 text-sm'>
          <span className='mr-1'>Email</span>{' '}
          <Tooltip content='You will receive a confirmation message'>
            <button className='-translate-y-px rounded-full'>
              <TbInfoCircle />
            </button>
          </Tooltip>
        </label>
        <input
          id='email'
          ref={emailInputRef}
          placeholder='example@gmail.com'
          type='text'
          className={clsx(
            'w-full rounded-lg border px-3 py-2 shadow placeholder:italic placeholder:text-zinc-900 not-[:last-child]:mb-1',
            parseErrors?.email?.length && 'outline-rose-400',
          )}
        />
        {parseErrors?.email?.length && <Errors field={parseErrors.email} />}
      </fieldset>
      <div className='mb-6'>
        <label className='mb-1 block text-sm'>Personal details</label>
        <div className='grid grid-cols-[min-content,1fr,1fr] gap-2 @max-md:grid-cols-[1fr]'>
          <TbUser className='size-10 rounded-full border border-dashed p-2.5 @max-md:hidden' />
          <div>
            <input
              ref={nameInputRef}
              autoComplete='name'
              placeholder='Name'
              type='text'
              className={clsx(
                'w-full rounded-lg border px-3 py-2 shadow placeholder:italic placeholder:text-zinc-900 not-[:last-child]:mb-1',
                parseErrors?.name?.length && 'outline-rose-400',
              )}
            />
            {parseErrors?.name?.length && <Errors field={parseErrors.name} />}
          </div>
          <div>
            <input
              ref={surnameInputRef}
              autoComplete='name'
              placeholder='Surname'
              type='text'
              className={clsx(
                'w-full rounded-lg border px-3 py-2 shadow placeholder:italic placeholder:text-zinc-900 not-[:last-child]:mb-1',
                parseErrors?.surname?.length && 'outline-rose-400',
              )}
            />
            {parseErrors?.surname?.length && <Errors field={parseErrors.surname} />}
          </div>
        </div>
      </div>
      {signUpError && <p>{signUpError.error.message}</p>}
      <button
        onClick={async () => {
          const parseRes = createUserSchema.safeParse({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value,
            email: emailInputRef.current.value.trim(),
            name: nameInputRef.current.value.trim(),
            surname: surnameInputRef.current.value.trim(),
          } satisfies Prisma.UserCreateInput)
          if (parseRes.error) {
            console.log(parseRes.error.flatten().fieldErrors.email)
            setParseErrors(parseRes.error.flatten().fieldErrors)
            return
          }
          const signUpRes = await signUpMutation.mutateAsync(parseRes.data)
          if (signUpRes.success) {
            await signInMutation.mutateAsync({
              login: loginInputRef.current.value.trim(),
              password: passwordInputRef.current.value.trim(),
            })
            router.push('/confirm/send')
          } else {
            setSignUpError(signUpRes)
            setTimeout(() => {
              setSignUpError(undefined)
            }, 1000 * 3)
          }
        }}
        disabled={signUpMutation.isPending || signInMutation.isPending}
        className='mb-4 flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50'
      >
        {signUpMutation.isPending || signInMutation.isPending ? <TbLoader className='animate-spin' /> : 'Continue'}
      </button>
      <button
        onClick={() => {
          headerStore.showUserPopup = true
        }}
        className='mx-auto block rounded-full px-2 text-center text-sm hover:text-zinc-900 hover:underline'
      >
        I already have an account
      </button>
    </div>
  )
}

function Errors({ field, ...props }: ComponentProps<'ul'> & { field: Errors[keyof Errors] }) {
  return (
    <ul {...props} className={clsx(props.className, 'flex flex-col')}>
      {field?.map((message, i) => (
        <li key={i} className='w-fit rounded-sm text-sm text-rose-700'>
          {message}
        </li>
      ))}
    </ul>
  )
}
