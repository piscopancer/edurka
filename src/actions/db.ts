// 'use server'

// import { db } from '#/prisma'
// import { Prisma, PrismaClient } from '@prisma/client'
// import { Operation } from '@prisma/client/runtime/library'

// export async function query<
//   const M extends Lowercase<Prisma.ModelName>,
//   const O extends Exclude<keyof typeof db[M], 'fields'>,
//   const F extends Parameters<typeof db[M][O]>[0],
// >(model: M, operation: O, args: F) {
//   const res = await db[model][operation](args)
//   return res
// }

// const users = await query('user', 'findMany', {
//   where: {
//     name: 'Billy'
//   },
//   include: {
//     createdCourses: true
//   }
// })
