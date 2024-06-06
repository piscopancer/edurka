import { defineConfig } from 'drizzle-kit'

export const dbCredentials = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
} as const

export default defineConfig({
  schema: ['./src/db/schema', './src/db/schema/tasks'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials,
  verbose: true,
  strict: true,
})
