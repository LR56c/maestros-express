import { z } from "zod"

export const messageSchema = z.object( {
  id        : z.string(),
  content   : z.string(),
  type      : z.string(),
  status    : z.string(),
  created_at: z.date()
} )

export type MessageDTO = z.infer<typeof messageSchema>

