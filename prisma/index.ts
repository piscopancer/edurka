import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DB_URL })
const adapter = new PrismaPg(pool)
export const db = new PrismaClient({ adapter }).$extends({
  
})
