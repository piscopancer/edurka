'use client'

import { AuthUser } from '@/auth'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbLoader } from 'react-icons/tb'
import { sendConfirmationEmail } from './actions'

export default function SendButton({ user, ...props }: ComponentProps<'button'> & { user: AuthUser }) {
  const sendConfirmationMutation = useMutation({ mutationFn: sendConfirmationEmail })

  return (
    <button
      disabled={sendConfirmationMutation.isPending || sendConfirmationMutation.isSuccess}
      onClick={() => {
        sendConfirmationMutation.mutate(user)
      }}
      {...props}
      className={clsx('hopper h-10 rounded-md bg-zinc-900 px-6 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50', props.className)}
    >
      {sendConfirmationMutation.isPending && <TbLoader className='animate-spin place-self-center' />}
      <span className={clsx('place-self-center', sendConfirmationMutation.isPending && 'invisible')}>
        {sendConfirmationMutation.isSuccess ? 'Email was sent' : 'Send confirmation message'}
      </span>
    </button>
  )
}
