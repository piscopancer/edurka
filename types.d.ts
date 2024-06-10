declare namespace NodeJS {
  interface ProcessEnv {
    readonly JWT_SECRET: string
    readonly NEXT_PUBLIC_URL: string
    readonly DB_URL: string
  }
}
