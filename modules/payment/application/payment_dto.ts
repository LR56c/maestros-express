import { z } from "zod"

export const paymentSchema = z.object( {
  id          : z.string(),
  service_type : z.string(),
  status      : z.string(),
  total       : z.number(),
  value_format: z.string(),
  created_at   : z.date()
} )

export type PaymentDTO = z.infer<typeof paymentSchema>

