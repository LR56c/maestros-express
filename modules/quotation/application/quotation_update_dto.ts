import { z } from "zod"
import {
  quotationDetailSchema
}            from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export const quotationUpdateSchema = z.object( {
  id            : z.string(),
  title         : z.string().optional(),
  status        : z.string().optional(),
  details       : z.array( quotationDetailSchema ).optional(),
  estimated_time: z.string().datetime().optional()
} )

export type QuotationUpdateDTO = z.infer<typeof quotationUpdateSchema>

