import { z }                  from "zod"
import { userResponseSchema } from "@/modules/user/application/user_response"
import {
  nationalIdentifierSchema
}                             from "@/modules/national_identity/application/national_identity_dto"
import {
  specialitySchema
}                             from "@/modules/speciality/application/speciality_dto"
import {
  certificateSchema
}                             from "@/modules/certificate/application/certificate_dto"
import {
  workerTaxSchema
}                             from "@/modules/worker_tax/application/worker_tax_dto"
import { storySchema }        from "@/modules/story/application/story_dto"
import {
  workerBookingSchema
}                             from "@/modules/worker_booking/application/worker_booking_dto"
import {
  workerScheduleSchema
}                             from "@/modules/worker_schedule/application/worker_schedule_dto"
import { packageSchema }      from "@/modules/package/application/package_dto"
import { reviewSchema }       from "@/modules/review/application/review_dto"
import { zoneSchema }         from "@/modules/zone/application/zone_dto"

export const workerResponseSchema = z.object( {
  user             : userResponseSchema,
  national_identity: nationalIdentifierSchema,
  birth_date       : z.date(),
  description      : z.string(),
  review_count     : z.number(),
  review_average   : z.number(),
  status         : z.string(),
  location         : z.string(),
  specialities     : z.array( specialitySchema ),
  certificates     : z.array( certificateSchema ),
  work_zones        : z.array( zoneSchema ),
  taxes            : z.array( workerTaxSchema ),
  stories          : z.array( storySchema ),
  bookings         : z.array( workerBookingSchema ),
  schedule         : z.array( workerScheduleSchema ),
  packages         : z.array( packageSchema ),
  reviews          : z.array( reviewSchema )
} )

export type WorkerResponse = z.infer<typeof workerResponseSchema>

