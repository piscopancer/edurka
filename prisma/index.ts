import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { enhance } from '@zenstackhq/runtime'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DB_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
export const db = enhance(prisma, {}, { kinds: ['delegate'] })
