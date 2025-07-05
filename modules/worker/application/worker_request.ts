import { z } from "zod"
import {
  userRegisterRequestSchema
}            from "@/modules/user/application/models/user_register_request"
import {
  latLngSchema
}            from "@/modules/shared/domain/value_objects/position"

export const workerRequestSchema = z.object( {
  user                   : userRegisterRequestSchema,
  national_identity_id   : z.string(),
  national_identity_value: z.string(),
  birth_date             : z.string().date(),
  description            : z.string().optional(),
  location               : latLngSchema
} )

export type WorkerRequest = z.infer<typeof workerRequestSchema>

