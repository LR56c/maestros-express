import { z } from "zod"

export const chatRequestSchema = z.object( {
  id       : z.string(),
  worker_id: z.string(),
  client_id  : z.string(),
  subject  : z.string()
} )

export type ChatRequest = z.infer<typeof chatRequestSchema>

