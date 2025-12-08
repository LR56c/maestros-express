import { z } from "zod"
import {
  specialitySchema
}            from "@/modules/speciality/application/speciality_dto"
import {
  workerTaxSchema
}            from "@/modules/worker_tax/application/worker_tax_dto"
import {
  userResponseSchema
}            from "@/modules/user/application/models/user_response"

export const workerResponseSchema = z.object( {
  user                   : userResponseSchema,
  national_identity_id   : z.string(),
  national_identity_value: z.string(),
  birth_date             : z.string(),
  description            : z.string().nullish(),
  review_count           : z.number(),
  review_average         : z.number(),
  status                 : z.string(),
  location               : z.string(),
  specialities           : z.array( specialitySchema ),
  taxes                  : z.array( workerTaxSchema )
  // work_zones        : z.array( zoneSchema ),
  // certificates     : z.array( certificateSchema ),
  // stories          : z.array( storySchema ),
  // bookings         : z.array( workerBookingSchema ),
  // schedule         : z.array( workerScheduleSchema ),
  // packages         : z.array( packageSchema ),
  // reviews          : z.array( reviewSchema )
} )

export type WorkerResponse = z.infer<typeof workerResponseSchema>

