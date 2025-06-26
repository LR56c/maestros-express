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
  birth_date       : z.string().date(),
  description      : z.string().optional(),
  status         : z.string(),
  location         : z.string(),
} )

export type WorkerRequest = z.infer<typeof workerRequestSchema>

