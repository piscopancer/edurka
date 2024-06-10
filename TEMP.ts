// import { ObjectSchema } from '@/utils'
// import { User } from '@prisma/client'
// import { z } from 'zod'

// const stringToBooleanSchema = z.string().transform((str) => {
//   switch (str) {
//     case 'true':
//       return true
//     case 'false':
//       return false
//   }
// })

// const categories = ['blowjob', 'anal'] as const

// export const testPagePathSchema = z.object({
//   params: z.object({
//     id: z.number({ coerce: true }),
//   }),
//   searchParams: (
//     z.object({
//       tutor: stringToBooleanSchema,
//       name: z.string(),
//       surname: z.string(),
//       categories: z.preprocess(
//         (encoded) => {
//           try {
//             if (typeof encoded === 'string') {
//               const parsed = JSON.parse(decodeURI(encoded))
//               if (typeof parsed === 'object' && Array.isArray(parsed)) {
//                 return parsed.filter((item) => categories.includes(item))
//               }
//             }
//           } catch (error) {
//             return undefined
//           }
//         },
//         z.array(z.enum(categories)),
//       ),
//     }) satisfies ObjectSchema<Pick<User, 'name' | 'surname' | 'tutor'> & Record<string, unknown>>
//   ).partial(),
// })

// export type CoercedTestPagePath = z.infer<typeof testPagePathSchema>

// type PagePath<P> = P extends { params: infer P; searchParams: infer SP } ? { params: Record<keyof P, string>; searchParams: Record<keyof SP, string | undefined> } : never

// export type TestPagePath = PagePath<CoercedTestPagePath>

// const p: CoercedTestPagePath = {
//   params: {
//     id: 1,
//   },
//   searchParams: {
//     // showFriends: true,
//     // search: 'gay@',
//   },
// }

// // const searchParams = new URLSearchParams(p.searchParams as unknown as Record<string, string>).toString()
