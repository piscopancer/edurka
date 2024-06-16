'use client'

import { pagePathSchema } from '@/types/path'
import { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

export default function useUrl<PageSchema extends ReturnType<typeof pagePathSchema>>(path: string, pageSchema: PageSchema) {
  type Page = z.infer<PageSchema>
  const nextSP = useSearchParams()
  const router = useRouter()

  function updateSP<K extends keyof Page['searchParams']>(sp: URLSearchParams, key: K, value: Page['searchParams'][K] | undefined) {
    if (value) {
      sp.set(key as string, typeof value === 'object' ? encodeURI(JSON.stringify(value)) : String(value))
    } else {
      sp.delete(key as string)
    }
  }

  function setSP<K extends keyof Page['searchParams']>(key: K, value: Page['searchParams'][K] | undefined) {
    const sp = new URLSearchParams(nextSP.toString())
    updateSP(sp, key, value)
    router.push(`${path}?${sp}` as Route, { scroll: false })
  }

  function writeSP<K extends keyof Page['searchParams']>(key: K, value: Page['searchParams'][K] | undefined) {
    const url = new URL(window.location.href)
    updateSP(url.searchParams, key, value)
    history.pushState(null, '', url)
  }

  function getSP<K extends keyof Page['searchParams']>(key: K) {
    const sp = new URLSearchParams(nextSP.toString())
    const spObj = Object.fromEntries(sp)
    const parseRes = pageSchema.shape.searchParams.parse(spObj)
    return parseRes[key as string] as Page['searchParams'][K]
  }

  function getAllSP() {
    const sp = new URLSearchParams(nextSP.toString())
    const spObj = Object.fromEntries(sp)
    const parseRes = pageSchema.shape.searchParams.parse(spObj)
    return parseRes as Page['searchParams']
  }

  return {
    sp: {
      get: getSP,
      set: setSP,
      getAll: getAllSP,
      write: writeSP,
    },
  }
}
