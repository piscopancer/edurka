'use client'

import * as RTooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'

type TooltipProps = {
  children?: React.ReactNode
  content: React.ReactNode
  arrow?: boolean
  delay?: number
  open?: boolean
} & Omit<RTooltip.TooltipContentProps, 'content'>

export function Tooltip({ children, content, arrow, delay, open, ...htmlProps }: TooltipProps) {
  return (
    <RTooltip.Provider delayDuration={delay ?? 500} disableHoverableContent>
      <RTooltip.Root open={open}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content {...htmlProps} className={clsx(htmlProps.className, 'z-[1] rounded-md bg-zinc-800 px-2 py-1 text-sm text-zinc-200')}>
            {content}
            {(arrow === undefined || arrow) && <RTooltip.Arrow className='fill-zinc-800' />}
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}
