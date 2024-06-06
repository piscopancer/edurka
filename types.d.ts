declare namespace NodeJS {
  interface ProcessEnv {
    readonly JWT_SECRET: string
    readonly DB_URL: string
  }
}
