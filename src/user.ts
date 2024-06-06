import { db } from '#/prisma'

export type CreateUser = Parameters<typeof db.user.create>[0]['data']
