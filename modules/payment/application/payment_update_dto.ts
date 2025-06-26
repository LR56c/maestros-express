import { z } from "zod"

export const paymentUpdateSchema = z.object( {
  id          : z.string(),
  status : z.string(),
} )

export type PaymentUpdateDTO = z.infer<typeof paymentUpdateSchema>
