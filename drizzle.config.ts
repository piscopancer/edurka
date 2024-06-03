import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:local.db",
  },
} satisfies Config
