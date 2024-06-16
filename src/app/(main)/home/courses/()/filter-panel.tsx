'use client'

import Search from '@/components/search'
import useUrl from '@/hooks/use-url'
import { objectEntries, route } from '@/utils'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { coursesPagePathSchema, defaultOrder, defaultSorting, getSortingOptions } from '.'

export default function FilterPanel({ ...props }: ComponentProps<'aside'> & {}) {
  const url = useUrl(route('/home/courses'), coursesPagePathSchema)
  const [search, setSearch] = useState(url.sp.get('search'))
  const sorting = url.sp.get('sorting') ?? defaultSorting
  const order = url.sp.get('order') ?? defaultOrder
  const OrderIcon = getSortingOptions()[sorting].orders[order].icon

  return (
    <aside {...props}>
      <div className='flex gap-2'>
        <Search
          change={(value) => {
            setSearch(value)
            url.sp.write('search', value.trim())
          }}
          clear={() => {
            setSearch(undefined)
            url.sp.write('search', undefined)
          }}
          value={search}
          className='mr-auto'
        />
        <Popover.Root>
          <Popover.Trigger className='flex items-center justify-center self-stretch rounded-full border px-4'>
            <OrderIcon className='size-5' />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align='end' sideOffset={4} className='rounded-xl border bg-zinc-200 shadow'>
              <ul className='py-2'>
                {objectEntries(getSortingOptions()).map(([_sorting, { title, orders }], i) => {
                  const Icon = getSortingOptions()[sorting].orders[order].icon
                  return (
                    <li key={i} className='contents'>
                      <button
                        onClick={() => {
                          if (sorting === _sorting) {
                            url.sp.write('order', url.sp.get('order') === 'asc' ? 'desc' : 'asc')
                          } else {
                            url.sp.write('sorting', _sorting)
                          }
                        }}
                        className={clsx(
                          'grid w-full grid-cols-[auto,1fr] gap-x-4 border-y border-transparent px-4 py-1 hover:border-inherit',
                          sorting === _sorting && 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800',
                        )}
                      >
                        <Icon className={clsx('row-span-2 size-6 self-center', sorting === _sorting ? '' : 'invisible')} />
                        <span className='justify-self-start'>{title}</span>
                        <span className='justify-self-start text-xs'>{orders[url.sp.get('order') ?? 'desc'].description}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <Popover.Arrow className='w-3' />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </aside>
  )
}
