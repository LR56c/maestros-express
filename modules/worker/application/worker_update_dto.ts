import { z } from "zod"
import {
  userResponseSchema
}            from "@/modules/user/application/user_response"
import {
  nationalIdentifierSchema
}            from "@/modules/national_identity/application/national_identity_dto"

export const workerUpdateSchema = z.object( {
  user          : userResponseSchema,
  description   : z.string(),
  review_count  : z.number(),
  review_average: z.number(),
  status        : z.string(),
  location      : z.string()
} )

export type WorkerUpdateDTO = z.infer<typeof workerUpdateSchema>

