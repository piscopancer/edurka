'use client'

import { signIn, signOut } from '@/actions/users'
import Notification from '@/components/notification'
import { useAuthUser, useNotifications } from '@/query/hooks'
import { route } from '@/utils'
import * as Popover from '@radix-ui/react-popover'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ComponentProps, useRef } from 'react'
import { TbBell, TbFlag, TbInboxOff, TbLoader, TbLogout, TbSchool, TbSelector } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { toggleTutor } from './actions'
import { headerStore } from './client'

type NavOption = {
  title: string
  route: string
}

function getRoutes({ tutorMode }: { tutorMode: boolean }) {
  const routes = [
    { title: 'Courses', route: route('/home/courses') },
    { title: 'Groups', route: route('/home/groups') },
  ] satisfies NavOption[]
  if (tutorMode) routes.push({ title: 'Works', route: '/home/works' }, { title: 'Tasks', route: '/home/tasks' })
  return routes
}

export default function Header({ tutorMode, ...props }: ComponentProps<'header'> & { tutorMode: boolean }) {
  const path = usePathname()
  const headerSnap = useSnapshot(headerStore)
  const toggleTutorMutation = useMutation({ mutationFn: toggleTutor })
  const router = useRouter()
  const routes = getRoutes({ tutorMode })
  const authUserQuery = useAuthUser()
  const notificationsQuery = useNotifications(authUserQuery.data?.id)
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      authUserQuery.refetch()
    },
  })

  return (
    <header {...props} className={clsx(props.className, 'sticky top-0 z-[1] border-b bg-zinc-200')}>
      <div className='flex items-center px-6 py-4'>
        <nav className='mr-auto'>
          <Link href={'/'} className='inline-block duration-100 hover:scale-105'>
            <TbSchool className='size-6' />
          </Link>
        </nav>
        {authUserQuery.data && path === '/' && (
          <Link href={'/home/courses'} className='rounded-full border border-transparent px-4 py-1 hover:border-inherit'>
            Back home
          </Link>
        )}
        {notificationsQuery?.data && (
          <Popover.Root>
            <Popover.Trigger className='self-stretch rounded-full border border-transparent px-4 hover:border-inherit'>
              <TbBell className='size-5' />
            </Popover.Trigger>
            <Popover.Content sideOffset={4} align='end' className='flex h-screen max-h-[60vh] w-96 max-w-[100vw] flex-col rounded-xl border bg-zinc-200 shadow max-md:w-auto'>
              <header className='border-b px-4 py-2'>
                <h2>Notifications</h2>
              </header>
              {notificationsQuery.data.length ? (
                <ul>
                  {notificationsQuery.data.map((ntf) => (
                    <li key={ntf.id} className='border-dashed px-4 py-2 not-[:last-child]:border-b'>
                      <Notification notification={ntf} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='flex grow flex-col items-center justify-center text-center'>
                  <TbInboxOff className='mb-3 size-6' />
                  <span className='max-w-1/2 text-sm'>Nothing new yet</span>
                </div>
              )}

              <Popover.Arrow className='w-3' />
            </Popover.Content>
          </Popover.Root>
        )}
        {authUserQuery.data?.tutor && (
          <button
            disabled={toggleTutorMutation.isPending}
            onClick={async () => {
              await toggleTutorMutation.mutateAsync(!tutorMode)
              router.refresh()
            }}
            className='flex items-center gap-x-2 rounded-full border py-1 pl-4 pr-3 shadow duration-100 disabled:opacity-50'
          >
            {tutorMode ? 'Tutor' : 'Student'}
            {toggleTutorMutation.isPending ? <TbLoader className='animate-spin' /> : <TbSelector />}
          </button>
        )}
        <Popover.Root onOpenChange={(open) => (headerStore.showUserPopup = open)} open={headerSnap.showUserPopup}>
          <Popover.Content sideOffset={4} align='end' className='w-64 rounded-xl border bg-zinc-200 shadow'>
            {authUserQuery.data ? (
              <menu className='py-2'>
                <Link
                  href={'/'}
                  onClick={() => {
                    headerStore.showUserPopup = false
                  }}
                  className='flex w-full items-center border-y border-transparent px-4 py-2 hover:border-inherit'
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
                  className='flex w-full items-center border-y border-transparent px-4 py-2 hover:border-inherit'
                >
                  <span className='mr-auto'>Sign out</span>
                  <TbLogout className='size-5' />
                </button>
              </menu>
            ) : (
              <LoginForm />
            )}
            <Popover.Arrow className='w-3' />
          </Popover.Content>
          <Popover.Trigger className='rounded-full border px-4 py-1'> {authUserQuery.data ? authUserQuery.data.name : 'Log in'}</Popover.Trigger>
        </Popover.Root>
      </div>
      {routes.some(({ route }) => path.includes(route)) && (
        <nav className={clsx(props.className, 'flex px-4 pb-2')}>
          {routes.map((r) => (
            <Link key={r.route} href={r.route} className={clsx('relative rounded-lg border px-4 py-1', path.includes(r.route) ? 'border-inherit' : 'border-transparent')}>
              {r.title}
              {/* {path.includes(r.route) && <div className='absolute inset-x-0 top-[calc(100%+theme(size.2)+1px)] h-[2px] bg-zinc-900' />} */}
            </Link>
          ))}
        </nav>
      )}
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
        <label className='mb-1 block text-sm'>Login</label>
        <input ref={loginInputRef} autoComplete='username' type='text' className='w-full rounded-lg border px-3 py-2 shadow' />
      </fieldset>
      <fieldset className=''>
        <label className='mb-1 block text-sm'>Password</label>
        <input ref={passwordInputRef} autoComplete='current-password' type='password' className='w-full rounded-lg border px-3 py-2 shadow' />
      </fieldset>
      <button className='mb-4 rounded-full text-xs hover:underline'>I forgot my password</button>
      <button
        disabled={signInMutation.isPending}
        onClick={() => {
          headerStore.showUserPopup = false
          signInMutation.mutate({
            login: loginInputRef.current.value.trim(),
            password: passwordInputRef.current.value.trim(),
          })
        }}
        className='mb-4 flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 text-zinc-200 duration-100 hover:bg-zinc-800 disabled:opacity-50'
      >
        {signInMutation.isPending ? <TbLoader className='size-5 animate-spin' /> : 'Continue'}
      </button>
      <button
        onClick={() => {
          headerStore.showUserPopup = false
          document.getElementById('sign-up')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className='mx-auto block rounded-full px-2 text-center text-xs hover:underline'
      >
        Sign up
      </button>
    </article>
  )
}
