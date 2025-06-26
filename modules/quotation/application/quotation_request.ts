import { z } from "zod"
import {
  quotationDetailSchema
}            from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export const quotationRequestSchema = z.object( {
  id            : z.string(),
  user_id       : z.string(),
  chat_id       : z.string(),
  worker_id     : z.string(),
  title         : z.string(),
  details       : z.array( quotationDetailSchema ),
  estimated_time: z.string().date().optional()
} )

export type QuotationRequest = z.infer<typeof quotationRequestSchema>

