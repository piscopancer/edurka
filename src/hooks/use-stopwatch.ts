'use client'

import { useEffect, useRef } from 'react'

type UseStopwatchProps = {
  interval: number
  onInterval?: (time: number) => void
  initial?: number
}

export default function useStopwatch(props: UseStopwatchProps) {
  const time = useRef(props.initial ?? 0)
  const stopwatchRef = useRef<Timer>(undefined!)

  useEffect(() => {
    return () => {
      clearInterval(stopwatchRef.current)
    }
  }, [])

  function resume() {
    stopwatchRef.current = setInterval(() => {
      time.current += props.interval
      props.onInterval?.(time.current)
    }, props.interval * 1000)
  }

  function start() {
    time.current = 0
    clearInterval(stopwatchRef.current)
    props.onInterval?.(time.current)
    resume()
  }

  function pause() {
    clearInterval(stopwatchRef.current)
    props.onInterval?.(time.current)
  }

  function stop() {
    pause()
    time.current = 0
    props.onInterval?.(0)
  }

  function travel(by: number) {
    time.current += by
    props.onInterval?.(time.current)
  }

  function set(to: number) {
    time.current = to
    clearInterval(stopwatchRef.current)
    props.onInterval?.(to)
    resume()
  }

  return { start, resume, pause, travel, stop, set }
}
