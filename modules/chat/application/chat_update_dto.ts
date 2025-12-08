import { z } from "zod"

export const chatUpdateSchema = z.object( {
  id       : z.string(),
  accepted_date     : z.string().date().nullish(),
  quotation_accepted: z.string().nullish(),
  worker_archived   : z.string().date().nullish(),
} )

export type ChatUpdateDTO = z.infer<typeof chatUpdateSchema>

