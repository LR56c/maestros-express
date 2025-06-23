import { z } from "zod"
import {
  quotationDetailSchema
} from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export const quotationSchema = z.object( {
  id            : z.string(),
  title         : z.string(),
  total         : z.number(),
  status        : z.string(),
  value_format  : z.string(),
  details: z.array( quotationDetailSchema),
  estimated_time: z.date().optional()
} )

export type QuotationDTO = z.infer<typeof quotationSchema>

