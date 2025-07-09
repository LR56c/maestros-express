import { z }           from "zod"
import {
  specialitySchema
}                      from "@/modules/speciality/application/speciality_dto"
import {
  userResponseSchema
}                      from "@/modules/user/application/models/user_response"
import {
  workerTaxSchema
}                      from "@/modules/worker_tax/application/worker_tax_dto"
import { zoneSchema }  from "@/modules/zone/application/zone_dto"
import {
  workerScheduleSchema
}                      from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  certificateSchema
}                      from "@/modules/certificate/application/certificate_dto"
import { storySchema } from "@/modules/story/application/story_dto"

export const workerUpdateSchema = z.object( {
  user          : userResponseSchema,
  description   : z.string().optional(),
  review_count  : z.number().optional(),
  review_average: z.number().optional(),
  status        : z.string().optional(),
  location      : z.string().optional(),
  verified      : z.boolean().optional(),
  specialities  : z.union( [z.array( specialitySchema ).optional(), z.null()] ),
  taxes         : z.union( [z.array( workerTaxSchema ).optional(), z.null()] ),
  zones         : z.union( [z.array( zoneSchema ).optional(), z.null()] ),
  certificates  : z.union(
    [z.array( certificateSchema ).optional(), z.null()] ),
  stories       : z.union( [z.array( storySchema ).optional(), z.null()] ),
  schedules     : z.union(
    [z.array( workerScheduleSchema ).optional(), z.null()] )
} )
export type WorkerUpdateDTO = z.infer<typeof workerUpdateSchema>
