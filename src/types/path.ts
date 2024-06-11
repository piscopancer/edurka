import { z } from 'zod'

export function pagePathSchema<P extends z.ZodRawShape, SP extends z.ZodRawShape>(path: { paramsSchema?: P; searchParamsSchema?: SP }) {
  return z.object({
    params: path.paramsSchema ? z.object(path.paramsSchema) : z.never(),
    searchParams: path.searchParamsSchema ? z.object(path.searchParamsSchema).partial() : z.never(),
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
