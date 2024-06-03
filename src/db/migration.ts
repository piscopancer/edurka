import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from '.'
;(async () => {
  console.log('before')
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('after')
})()
