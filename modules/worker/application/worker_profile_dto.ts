import { z } from "zod"
import {
  specialitySchema
}            from "@/modules/speciality/application/speciality_dto"
import {
  workerTaxSchema
}            from "@/modules/worker_tax/application/worker_tax_dto"

export const workerProfileSchema = z.object( {
  user_id       : z.string(),
  full_name     : z.string(),
  avatar        : z.string().nullish(),
  age           : z.number().int(),
  description   : z.string().nullish(),
  review_count  : z.number(),
  review_average: z.number(),
  location      : z.string(),
  status      : z.string(),
  specialities  : z.array( specialitySchema ),
  taxes         : z.array( workerTaxSchema )
} )

export type WorkerProfileDTO = z.infer<typeof workerProfileSchema>

