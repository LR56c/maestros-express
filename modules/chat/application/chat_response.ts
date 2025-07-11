import { z } from "zod"
import {
  messageResponseSchema
}            from "@/modules/message/application/message_response"
import {
  userResponseSchema
}            from "@/modules/user/application/models/user_response"

export const chatResponseSchema = z.object( {
  id                : z.string(),
  worker            : userResponseSchema,
  client            : userResponseSchema,
  subject           : z.string(),
  accepted_date     : z.string().datetime().optional(),
  quotation_accepted: z.string().optional(),
  worker_archived   : z.string().datetime().optional(),
  created_at        : z.string().datetime(),
  messages          : z.array( messageResponseSchema )
} )

export type ChatResponse = z.infer<typeof chatResponseSchema>

