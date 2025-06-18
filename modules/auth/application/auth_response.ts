import { z } from "zod"

export const authResponseSchema = z.object( {
  user_id: z.string(),
  email  : z.string()
} )

export type AuthResponse = z.infer<typeof authResponseSchema>
