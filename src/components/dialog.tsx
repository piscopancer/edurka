import * as RDialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { ReactNode } from 'react'

type DialogProps = {
  Trigger: (props: { Trigger: typeof RDialog.Trigger }) => ReactNode
  Content: (props: { Trigger: typeof RDialog.Trigger }) => ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function Dialog({ open, onOpenChange, Content, Trigger, ...props }: HTMLMotionProps<'div'> & DialogProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <Trigger Trigger={RDialog.Trigger} />
      <AnimatePresence>
        {open && (
          <RDialog.Portal forceMount>
            <motion.div className='z-[1]' exit={{ opacity: 0, transition: { duration: 0.2 } }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RDialog.Overlay className='bg-halftone fixed inset-0' />
            </motion.div>
            <RDialog.Content asChild>
              <motion.div
                exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { ease: 'backOut' } }}
                {...props}
                className={clsx(props.className, 'fixed inset-0 z-[1] mx-auto my-4 flex max-w-screen-lg grow flex-col rounded-xl border bg-zinc-200 @container max-md:my-0')}
              >
                <Content Trigger={RDialog.Trigger} />
              </motion.div>
            </RDialog.Content>
          </RDialog.Portal>
        )}
      </AnimatePresence>
    </RDialog.Root>
  )
}
