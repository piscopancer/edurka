declare namespace NodeJS {
  interface ProcessEnv {
    readonly JWT_SECRET: string
    readonly DB_HOST: string
    readonly DB_PORT: string
    readonly DB_USER: string
    readonly DB_PASSWORD: string
    readonly DB_NAME: string
  }
}
