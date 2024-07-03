import { z } from 'zod'

const titleMaxLength = 64

export const titleSchema = z
  .string()
  .min(1, { message: 'Cannot be empty' })
  .max(titleMaxLength, { message: `Cannot be longer than ${titleMaxLength} characters` })
