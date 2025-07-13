import { z } from "zod"
import {
  userResponseSchema
} from "@/modules/user/application/models/user_response"
import {
  specialitySchema
} from "@/modules/speciality/application/speciality_dto"
import {
  workerTaxSchema
} from "@/modules/worker_tax/application/worker_tax_dto"
import { zoneSchema } from "@/modules/zone/application/zone_dto"
import {
  certificateSchema
} from "@/modules/certificate/application/certificate_dto"
import { storySchema } from "@/modules/story/application/story_dto"
import {
  workerScheduleSchema
} from "@/modules/worker_schedule/application/worker_schedule_dto"

export const workerExtraSchema = z.object( {
  user        : userResponseSchema,
  specialities: z.array( specialitySchema ),
  taxes       : z.array( workerTaxSchema ),
  zones       : z.array( zoneSchema ),
  certificates: z.array( certificateSchema ),
  stories     : z.array( storySchema ),
  schedules   : z.array( workerScheduleSchema )
} )
export type WorkerExtra = z.infer<typeof workerExtraSchema>