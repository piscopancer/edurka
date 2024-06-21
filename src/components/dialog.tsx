'use client'

import { StrictOmit } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { Children, PropsWithChildren, useEffect, useState } from 'react'

export function Root({
  children,
  contentProps,
  ...props
}: PropsWithChildren<StrictOmit<Dialog.DialogProps, 'defaultOpen'> & { contentProps?: HTMLMotionProps<'div'> & { size?: 'base' | 'sm' } }>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (Children.count(children) !== 2) {
      throw new Error('Dialog must have exactly 2 children. 1st child is a trigger, 2nd is content')
    }
  }, [children])

  const [trigger, content] = Children.toArray(children)

  return (
    <Dialog.Root
      open={props.open !== undefined ? props.open : open}
      onOpenChange={(o) => {
        if (props.onOpenChange !== undefined) {
          props.onOpenChange(o)
        } else {
          setOpen(o)
        }
      }}
    >
      {trigger}
      <AnimatePresence>
        {(props.open !== undefined ? props.open : open) && (
          <Dialog.Portal forceMount>
            <motion.div className='z-[1]' exit={{ opacity: 0, transition: { duration: 0.2 } }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dialog.Overlay className='bg-halftone fixed inset-0' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div
                {...contentProps}
                exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { ease: 'backOut' } }}
                className={clsx(
                  contentProps?.className,
                  contentProps?.size === 'sm' ? 'my-auto max-h-fit max-w-screen-sm max-md:mx-4' : 'my-4 max-w-screen-lg max-md:my-0',
                  'fixed inset-0 z-[1] mx-auto flex flex-col rounded-xl border bg-zinc-200 @container',
                )}
              >
                {content}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export const Trigger = Dialog.Trigger
