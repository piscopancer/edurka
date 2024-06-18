import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { TbLoader, TbSearch, TbX } from 'react-icons/tb'

type SearchProps = {
  change: (value: string) => void
  clear: (value: undefined) => void
  loading?: boolean
}

export default function Search({ change, clear, defaultValue, loading, id, ...props }: { id?: string; defaultValue?: string; className?: string } & SearchProps) {
  const [value, setValue] = useState(defaultValue ?? '')

  return (
    <div className={clsx(props.className, 'hopper')}>
      <input
        id={id}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          change(e.target.value)
        }}
        type='text'
        className='rounded-full border px-12 py-2 shadow'
      />
      <motion.div key={String(loading)} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='hopper ml-4 self-center justify-self-start'>
        {loading ? <TbLoader className='animate-spin place-self-center' /> : <TbSearch className='place-self-center' />}
      </motion.div>
      {value && (
        <button
          onClick={() => {
            setValue('')
            clear(undefined)
          }}
          className='mr-2 flex size-7 items-center justify-center self-center justify-self-end rounded-full border border-transparent hover:border-inherit'
        >
          <TbX />
        </button>
      )}
    </div>
  )
}
