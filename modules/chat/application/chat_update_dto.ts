import { z } from "zod"

export const chatUpdateSchema = z.object( {
  id       : z.string(),
  accepted_date     : z.string().date().optional(),
  quotation_accepted: z.string().optional(),
  worker_archived   : z.string().date().optional(),
} )

export type ChatUpdateDTO = z.infer<typeof chatUpdateSchema>

