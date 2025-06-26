import { z } from "zod"

export const chatResponseSchema = z.object( {
  id                : z.string(),
  subject           : z.string(),
  accepted_date     : z.date().optional(),
  quotation_accepted: z.string().optional(),
  worker_archived   : z.date().optional(),
  created_at        : z.date()
} )

export type ChatResponse = z.infer<typeof chatResponseSchema>

