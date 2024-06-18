import { z } from 'zod'

export function pageUrlSchema<P extends z.ZodRawShape, SP extends z.ZodRawShape>({
  paramsSchema = {} as P,
  searchParamsSchema = {} as SP,
}: {
  paramsSchema?: P
  searchParamsSchema?: SP
}) {
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
