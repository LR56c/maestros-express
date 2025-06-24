import { z } from "zod"
import {
  userResponseSchema
}            from "@/modules/user/application/user_response"
import {
  nationalIdentifierSchema
}            from "@/modules/national_identity/application/national_identity_dto"

export const workerRequestSchema = z.object( {
  user             : userResponseSchema,
  national_identity: nationalIdentifierSchema,
  birth_date       : z.date(),
  description      : z.string(),
  review_count     : z.number(),
  review_average   : z.number(),
  status         : z.string(),
  location         : z.string(),
} )

export type WorkerRequest = z.infer<typeof workerRequestSchema>

