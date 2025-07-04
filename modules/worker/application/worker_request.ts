import { z } from "zod"
import {
  nationalIdentifierSchema
}            from "@/modules/national_identity/application/national_identity_dto"
import {
  userRegisterRequestSchema
}            from "@/modules/user/application/models/user_register_request"

export const workerRequestSchema = z.object( {
  user             : userRegisterRequestSchema,
  national_identity: nationalIdentifierSchema,
  birth_date       : z.string().date(),
  description      : z.string().optional(),
  status           : z.string(),
  location         : z.string()
} )

export type WorkerRequest = z.infer<typeof workerRequestSchema>

