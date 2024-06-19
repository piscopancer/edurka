'use client'

import Search from '@/components/search'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuthUser, useTutorMode } from '@/query/hooks'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { defaultOrder, defaultSorting, getFilteredSortingOptions, sortingOptions, useCoursesPageUrl } from '.'

export default function FilterPanel({ ...props }: ComponentProps<'aside'>) {
  const url = useCoursesPageUrl()
  const { data: tutorMode } = useTutorMode()
  const [search, setSearch] = useState(url.sp.get('search'))
  const sorting = url.sp.get('sorting') ?? defaultSorting
  const order = url.sp.get('order') ?? defaultOrder
  const OrderIcon = sortingOptions[sorting].orders[order].icon
  const searchDebouncer = useDebounce({
    callback(search: string) {
      setSearch(search)
      url.sp.write('search', search.trim())
    },
    seconds: 0.7,
  })
  const authUserQuery = useAuthUser()
  if (!authUserQuery.data) return null

  return (
    <aside {...props}>
      <div className='flex gap-2'>
        <Search
          change={searchDebouncer.call}
          clear={() => {
            setSearch(undefined)
            url.sp.write('search', undefined)
          }}
          defaultValue={search}
          className='mr-auto'
        />
        <Popover.Root>
          <Popover.Trigger className='flex items-center justify-center self-stretch rounded-full border px-4'>
            <OrderIcon className='size-5' />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content align='end' sideOffset={4} className='rounded-xl border bg-zinc-200 shadow'>
              <ul className='py-2'>
                {getFilteredSortingOptions(!!tutorMode).map(([_sorting, option], i) => {
                  const Icon = option.orders[order].icon
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
                        <span className='justify-self-start'>{option.title}</span>
                        <span className='justify-self-start text-xs'>{option.orders[url.sp.get('order') ?? 'desc'].description}</span>
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
