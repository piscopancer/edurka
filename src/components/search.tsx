import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbSearch, TbX } from 'react-icons/tb'

type SearchProps = {
  value: string | undefined
  change: (value: string) => void
  clear: (value: undefined) => void
  inputId?: string
}

export default function Search({ change, clear, value, inputId, ...props }: ComponentProps<'div'> & SearchProps) {
  props
  return (
    <div {...props} className={clsx(props.className, 'hopper')}>
      <input id={inputId} value={value ?? ''} onChange={(e) => change(e.target.value)} type='text' className='rounded-full border px-12 py-2 shadow' />
      <TbSearch className='ml-4 self-center justify-self-start' />
      {value && (
        <button
          onClick={() => clear(undefined)}
          className='mr-2 flex size-7 items-center justify-center self-center justify-self-end rounded-full border border-transparent hover:border-inherit'
        >
          <TbX />
        </button>
      )}
    </div>
  )
}
