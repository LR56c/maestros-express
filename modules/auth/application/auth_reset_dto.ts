import { z } from "zod"

export const authResetSchema = z.object( {
  method: z.string(),
  data  : z.string().optional()
} )

export type AuthResetDTO = z.infer<typeof authResetSchema>
