import { Attrs } from '@/tiptap'
import * as Popover from '@radix-ui/react-popover'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import clsx from 'clsx'
import { useState } from 'react'
import { TbExclamationCircle, TbTrash, TbX } from 'react-icons/tb'
import { z } from 'zod'

type SelectOneProps = Omit<NodeViewProps, 'updateAttributes'> & {
  node: {
    attrs: Attrs
  }
  updateAttributes: (attrs: Partial<Attrs>) => void
}

const optionsToArraySchema = z.string().transform((options) => options.split(', '))
const optionsToStringSchema = z.array(z.string()).transform((options) => options.join(', '))

export default function SelectOne(props: SelectOneProps) {
  const [showOptions, setShowOptions] = useState(false)
  const parseRes = optionsToArraySchema.safeParse(props.node.attrs.options)
  const parsedOptions = parseRes.success ? parseRes.data : []

  return (
    <NodeViewWrapper>
      <Popover.Root open={showOptions} onOpenChange={setShowOptions}>
        <Popover.Trigger
          onClick={() => setShowOptions(true)}
          className={clsx('rounded-lg border px-3 py-0.5 text-sm duration-100 hover:bg-zinc-300', !parsedOptions[props.node.attrs.correctAnswer].trim() && 'animate-pulse')}
        >
          {parsedOptions[props.node.attrs.correctAnswer].trim() || '...'}
        </Popover.Trigger>
        <Popover.Content asChild align='start'>
          <article className='rounded-xl border bg-zinc-200 shadow'>
            <header className='flex items-center rounded-t border-b border-dashed py-1'>
              <h3 className='ml-2 mr-auto text-sm'>Select correct option</h3>
              <button onClick={() => setShowOptions(false)} className='mr-2 rounded-full'>
                <TbX className='size-7 p-1.5' />
              </button>
            </header>
            <ul className='my-2 grid grid-cols-[auto,1fr,auto] gap-x-2 px-2'>
              {parsedOptions.map((option, i) => {
                const selected = i === props.node.attrs.correctAnswer
                const duplicate = parsedOptions.filter((opt) => opt === option).length > 1
                return (
                  <li key={i} className='col-span-full grid grid-cols-subgrid items-center'>
                    <button
                      disabled={selected}
                      onClick={() => {
                        props.updateAttributes({
                          correctAnswer: i,
                        })
                      }}
                      className={clsx(
                        'flex size-5 items-center justify-center rounded-full border',
                        selected ? (duplicate ? 'border-transparent bg-rose-800/50' : 'border-accent bg-accent') : duplicate ? 'border-rose-800/50' : '',
                      )}
                    >
                      {selected && <div className='size-3/5 rounded-full bg-zinc-200' />}
                    </button>
                    <input
                      type='text'
                      value={option}
                      placeholder='Option'
                      onChange={(e) => {
                        props.updateAttributes({
                          options: optionsToStringSchema.parse(parsedOptions.map((opt, index) => (index === i ? e.target.value : opt))),
                        })
                      }}
                      className={clsx('w-full rounded-md px-2 py-1 text-sm placeholder:text-zinc-500', duplicate && 'font-medium text-rose-800')}
                    />
                    <button
                      disabled={parsedOptions.length === 1}
                      onClick={() => {
                        props.updateAttributes({
                          options: optionsToStringSchema.parse(parsedOptions.filter((_, index) => i !== index)),
                        })
                        props.updateAttributes({
                          correctAnswer: 0,
                        })
                      }}
                      className='rounded-full border border-transparent enabled:hover:border-zinc-900 disabled:opacity-50'
                    >
                      <TbTrash className='size-7 p-1.5' />
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className='mx-2'>
              {parsedOptions.length !== new Set(parsedOptions).size && (
                <p className='mb-2 flex items-center gap-x-2 text-sm font-medium text-rose-800'>
                  <TbExclamationCircle /> Please remove duplicates
                </p>
              )}
              <button
                onClick={() => {
                  props.updateAttributes({ options: optionsToStringSchema.parse([...parsedOptions, 'New option']) })
                }}
                className='mb-2 w-full rounded-md border py-1 text-center text-sm duration-100 hover:bg-zinc-300'
              >
                + Add option
              </button>
            </div>
            <Popover.Arrow className='w-3 fill-zinc-900' />
          </article>
        </Popover.Content>
      </Popover.Root>
    </NodeViewWrapper>
  )
}
