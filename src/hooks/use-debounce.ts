'use client'

import { useRef } from 'react'

type UseDebounceProps<CallbackParam> = {
  seconds: number
  callback: (param: CallbackParam) => void
}

export function useDebounce<CallbackParam>(props: UseDebounceProps<CallbackParam>) {
  const timer = useRef<Timer | null>(null)

  function call(param: CallbackParam, onComplete?: (param: CallbackParam, seconds: number) => void) {
    cancel()
    timer.current = setTimeout(() => {
      props.callback(param)
      onComplete?.(param, props.seconds)
    }, props.seconds * 1000)
  }

  function cancel() {
    timer.current && clearTimeout(timer.current)
  }

  return { call, cancel }
}
