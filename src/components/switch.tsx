import { accentColor } from '@/utils'
import clsx from 'clsx'
import { animate, HTMLMotionProps, motion, useMotionValue } from 'framer-motion'
import colors from 'tailwindcss/colors'

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
              backgroundColor: accentColor,
              x: [0, 5, 0],
              transition: {
                x: {
                  duration: 0.5,
                  times: [0.1, 0.4, 1],
                },
              },
            }
          : {
              backgroundColor: colors.zinc[300],
            }
      }
      onPointerDown={() => {
        animate(knobScaleYMv, 0.9, { type: 'spring' })
      }}
      onPointerUp={() => {
        animate(knobScaleYMv, 1, { type: 'spring' })
      }}
      className={clsx(htmlProps.className, enabled ? 'justify-end' : 'justify-start', 'flex h-8 w-12 rounded-full p-1')}
    >
      <motion.div
        layout
        initial={false}
        animate={{
          backgroundColor: enabled ? colors.zinc[100] : colors.zinc[200],
        }}
        style={{
          scaleY: knobScaleYMv,
        }}
        transition={{
          layout: {
            duration: 0.1,
          },
        }}
        className={clsx('aspect-square h-6 rounded-full')}
      />
    </motion.button>
  )
}
