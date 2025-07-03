import { z } from "zod"
import {
  messageResponseSchema
}            from "@/modules/message/application/message_response"

export const chatResponseSchema = z.object( {
  id                : z.string(),
  worker_id         : z.string(),
  client_id         : z.string(),
  worker_name       : z.string(),
  client_name       : z.string(),
  subject           : z.string(),
  accepted_date     : z.date().optional(),
  quotation_accepted: z.string().optional(),
  worker_archived   : z.date().optional(),
  created_at        : z.date(),
  messages          : z.array( messageResponseSchema )
} )

export type ChatResponse = z.infer<typeof chatResponseSchema>

