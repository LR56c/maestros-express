import { z } from "zod"
import {
  quotationDetailSchema
}            from "@/modules/quotation/modules/quotation_detail/application/quotation_detail_dto"

export const quotationUpdateSchema = z.object( {
  id            : z.string(),
  title         : z.string().nullish(),
  status        : z.string().nullish(),
  details       : z.array( quotationDetailSchema ).nullish(),
  estimated_time: z.string().datetime().nullish()
} )

export type QuotationUpdateDTO = z.infer<typeof quotationUpdateSchema>

