import clsx from 'clsx'
import { animate, HTMLMotionProps, motion, useMotionValue } from 'framer-motion'

export default function Switch({ action, enabled, ...htmlProps }: HTMLMotionProps<'button'> & { enabled: boolean; action: (current: boolean) => Promise<boolean> | boolean }) {
  const knobScaleYMv = useMotionValue(1)

  async function onClick() {
    await action(!enabled)
  }

  return (
    <motion.button
      {...htmlProps}
      onClick={onClick}
      initial={false}
      animate={
        enabled
          ? {
              x: [0, 5, 0],
              transition: {
                x: {
                  duration: 0.5,
                  times: [0.1, 0.4, 1],
                },
              },
            }
          : {}
      }
      onPointerDown={() => {
        animate(knobScaleYMv, 0.9, { type: 'spring' })
      }}
      onPointerUp={() => {
        animate(knobScaleYMv, 1, { type: 'spring' })
      }}
      className={clsx(htmlProps.className, enabled ? 'justify-end border-accent bg-accent' : 'justify-start', 'flex h-8 w-12 items-center rounded-full border p-1')}
    >
      <motion.div
        layout
        initial={false}
        style={{
          scaleY: knobScaleYMv,
        }}
        transition={{
          layout: {
            duration: 0.1,
          },
        }}
        className={clsx('aspect-square h-6 rounded-full border bg-zinc-200', enabled && 'border-zinc-200')}
      />
    </motion.button>
  )
}
