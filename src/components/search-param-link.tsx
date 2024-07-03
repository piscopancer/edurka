'use client'

import { pageUrlSchema } from '@/types/url'
import { StrictOmit } from '@/utils'
import { Route } from 'next'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ComponentProps } from 'react'

export default function SearchParamLink<
  UrlSchema extends ReturnType<typeof pageUrlSchema>,
  Url extends Zod.infer<UrlSchema> = Zod.infer<UrlSchema>,
  SearchParam extends keyof Url['searchParams'] = keyof Url['searchParams'],
  Value extends Url['searchParams'][SearchParam] = Url['searchParams'][SearchParam],
>({ searchParam, value, ...props }: { searchParam: SearchParam; value: Value } & StrictOmit<ComponentProps<'a'>, 'href'>) {
  const path = usePathname()
  const searchParams = useSearchParams()
  const targetSearchParams = new URLSearchParams(searchParams.toString())
  if (value) {
    targetSearchParams.set(searchParam.toString(), value)
  } else {
    targetSearchParams.delete(searchParam.toString())
  }

  return (
    <Link {...props} href={(path + '?' + targetSearchParams.toString()) as Route}>
      {props.children}
    </Link>
  )
}
