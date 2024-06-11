import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbSearch, TbX } from 'react-icons/tb'

type SearchProps = {
  value: string
  change: (value: string) => void
  clear: () => void
  inputId?: string
}

export default function Search({ change, clear, value = '', inputId, ...props }: ComponentProps<'div'> & SearchProps) {
  props
  return (
    <div {...props} className={clsx(props.className, 'hopper')}>
      <input id={inputId} value={value} onChange={(e) => change(e.target.value.trim())} type='text' className='rounded-full bg-zinc-300 px-12 py-2' />
      <TbSearch className='ml-4 self-center justify-self-start stroke-zinc-500' />
      {value && (
        <button onClick={clear} className='mr-2 size-6 self-center justify-self-end rounded-full p-1 text-zinc-500 duration-100 hover:bg-zinc-400/50'>
          <TbX className='size-4' />
        </button>
      )}
    </div>
  )
}
