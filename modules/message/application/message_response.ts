import { z } from "zod"

export const messageResponseSchema = z.object( {
  id        : z.string(),
  user_id   : z.string(),
  content   : z.string(),
  type      : z.string(),
  status    : z.string(),
  created_at: z.string().datetime()
} )

export type MessageResponse = z.infer<typeof messageResponseSchema>

