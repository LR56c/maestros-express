import { z } from "zod"

export const paymentRequestSchema = z.object( {
  id          : z.string(),
  service_id  : z.string(),
  client_id   : z.string(),
  service_type : z.string(),
  status : z.string(),
  total       : z.number(),
  value_format: z.string(),
} )

export type PaymentRequest = z.infer<typeof paymentRequestSchema>
