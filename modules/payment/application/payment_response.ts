import { z } from "zod"

export const paymentResponseSchema = z.object( {
  id          : z.string(),
  service_type: z.string(),
  status      : z.string(),
  total       : z.number(),
  value_format: z.string(),
  created_at  : z.string().datetime()
} )

export type PaymentResponse = z.infer<typeof paymentResponseSchema>

