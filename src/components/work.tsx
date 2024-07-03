'use client'

import * as Dialog from '@/components/dialog'
import { type Work } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import { ComponentProps, useState } from 'react'
import { TbDotsVertical, TbTrash } from 'react-icons/tb'

export default function Work({ tutorMode, work, ...props }: { tutorMode: boolean; work: Work } & ComponentProps<'article'>) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [confirmDeletionOpen, setConfirmDeletionOpen] = useState(false)

  return (
    <>
      <article {...props} className='rounded-lg border shadow'>
        <header className='flex items-center pl-4'>
          <h2 className='mr-auto'>{work.title}</h2>
          <Popover.Root open={moreOpen} onOpenChange={setMoreOpen}>
            <Popover.Trigger>
              <TbDotsVertical className='size-10 p-2.5' />
            </Popover.Trigger>
            <Popover.Content side='top' align='end' className='w-64 rounded-lg border bg-zinc-200 py-2 shadow'>
              <menu>
                {tutorMode && (
                  <button
                    onClick={() => {
                      setMoreOpen(false)
                      setConfirmDeletionOpen(true)
                    }}
                    className='flex w-full items-center border-y border-transparent px-4 py-2 hover:border-inherit'
                  >
                    <span className='mr-auto'>Exclude</span>
                    <TbTrash />
                  </button>
                )}
              </menu>
              <Popover.Arrow className='w-3' />
            </Popover.Content>
          </Popover.Root>
        </header>
      </article>
      <Dialog.Root open={confirmDeletionOpen} onOpenChange={setConfirmDeletionOpen} contentProps={{ size: 'sm' }}>
        <></>
        <>
          <p className='border-b p-4 text-center'>
            Current action is not deletion. This work will be <strong>excluded</strong> from this course, not deleted. It will remain as one of your created works and you will not
            lose access to it
          </p>
          <footer className='flex gap-3 px-4 py-3'>
            <Dialog.Trigger className='grow basis-0 rounded-lg border py-1'>Cancel</Dialog.Trigger>
            <Dialog.Trigger className='grow basis-0 rounded-lg border bg-zinc-900 py-1 text-zinc-200 hover:bg-zinc-800'>Exclude</Dialog.Trigger>
          </footer>
        </>
      </Dialog.Root>
    </>
  )
}
