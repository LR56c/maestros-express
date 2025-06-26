import { z } from "zod"

export const messageRequestSchema = z.object( {
  id        : z.string(),
  chat_id        : z.string(),
  user_id        : z.string(),
  content   : z.string(),
  type      : z.string(),
} )

export type MessageRequest = z.infer<typeof messageRequestSchema>

