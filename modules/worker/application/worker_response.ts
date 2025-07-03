import { z } from "zod"
import {
  userResponseSchema
}            from "@/modules/user/backup_application/user_response"
import {
  nationalIdentifierSchema
}            from "@/modules/national_identity/application/national_identity_dto"
import {
  specialitySchema
}            from "@/modules/speciality/application/speciality_dto"
import {
  workerTaxSchema
}            from "@/modules/worker_tax/application/worker_tax_dto"

export const workerResponseSchema = z.object( {
  user             : userResponseSchema,
  national_identity: nationalIdentifierSchema,
  birth_date       : z.string(),
  description      : z.string().optional(),
  review_count     : z.number(),
  review_average   : z.number(),
  status         : z.string(),
  location         : z.string(),
  specialities     : z.array( specialitySchema ),
  taxes            : z.array( workerTaxSchema ),
  // work_zones        : z.array( zoneSchema ),
  // certificates     : z.array( certificateSchema ),
  // stories          : z.array( storySchema ),
  // bookings         : z.array( workerBookingSchema ),
  // schedule         : z.array( workerScheduleSchema ),
  // packages         : z.array( packageSchema ),
  // reviews          : z.array( reviewSchema )
} )

export type WorkerResponse = z.infer<typeof workerResponseSchema>

