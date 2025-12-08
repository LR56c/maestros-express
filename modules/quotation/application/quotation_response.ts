import { z } from "zod"
import {
  quotationDetailSchema
}            from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export const quotationResponseSchema = z.object( {
  id            : z.string(),
  title         : z.string(),
  total         : z.number(),
  status        : z.string(),
  value_format  : z.string(),
  details: z.array( quotationDetailSchema),
  estimated_time: z.string().datetime().nullish()
} )

export type QuotationResponse = z.infer<typeof quotationResponseSchema>

