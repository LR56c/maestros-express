import { z } from "zod"

export const messageResponseSchema = z.object( {
  id        : z.string(),
  user_id           : z.string(),
  content   : z.string(),
  type      : z.string(),
  status    : z.string(),
  created_at: z.date()
} )

export type MessageResponse = z.infer<typeof messageResponseSchema>

