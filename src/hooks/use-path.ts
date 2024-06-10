import { Route } from 'next'
import { useSearchParams as useNextSearchParams, useRouter } from 'next/navigation'
import { z } from 'zod'

export default function usePath<PageSchema extends ReturnType<typeof pagePathSchema>>(path: string, pageSchema: PageSchema) {
  type Page = z.infer<PageSchema>
  const nextSP = useNextSearchParams()
  const router = useRouter()
  const sp = new URLSearchParams(nextSP.toString())
  const updateRoute = () => router.push(`${path}?${sp}` as Route, { scroll: false })
  function setSP<K extends keyof Page['searchParams']>(key: K, value: Page['searchParams'][K] | undefined) {
    if (value) {
      sp.set(key as string, typeof value === 'object' ? encodeURI(JSON.stringify(value)) : String(value))
    } else {
      sp.delete(key as string)
    }
    updateRoute()
  }
  function getSP<K extends keyof Page['searchParams']>(key: K) {
    return sp.get(key as string) as Page['searchParams'][K]
  }
  function getAllSP() {
    const spObj = Object.fromEntries(sp)
    const parseRes = pageSchema.shape.searchParams.safeParse(spObj)
    return parseRes.data
  }
  return {
    sp: {
      get: getSP,
      set: setSP,
      getAll: getAllSP,
    },
  }
}

export function pagePathSchema<P extends z.ZodRawShape, SP extends z.ZodRawShape>(paramsSchema: P, searchParamsSchema: SP) {
  return z.object({
    params: z.object(paramsSchema),
    searchParams: z.object(searchParamsSchema).partial(),
  })
}

export const stringToBooleanSchema = z.string().transform((str) => {
  switch (str) {
    case 'true':
      return true
    case 'false':
      return false
  }
})

export function encodedArraySchema<Arr extends Parameters<typeof z.enum>[0]>(arr: Readonly<Arr>) {
  return z.preprocess(
    (encoded) => {
      try {
        if (typeof encoded === 'string') {
          const parsed = JSON.parse(decodeURI(encoded))
          if (typeof parsed === 'object' && Array.isArray(parsed)) {
            return parsed.filter((item) => arr.includes(item))
          }
        }
      } catch (error) {
        return undefined
      }
    },
    z.array(z.enum(arr)),
  )
}
