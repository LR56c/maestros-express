import { z } from "zod"

export const chatSchema = z.object( {
  id                : z.string(),
  subject           : z.string(),
  accepted_date     : z.date().optional(),
  quotation_accepted: z.string().optional(),
  worker_archived   : z.date().optional(),
  created_at        : z.date()
} )

export type ChatDTO = z.infer<typeof chatSchema>

