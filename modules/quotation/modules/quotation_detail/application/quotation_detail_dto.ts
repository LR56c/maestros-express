import { z } from "zod"

export const quotationDetailSchema = z.object( {
  id          : z.string(),
  name        : z.string(),
  description : z.string().optional(),
  value       : z.coerce.number().int(),
  value_format: z.string()
} )

export type QuotationDetailDTO = z.infer<typeof quotationDetailSchema>

