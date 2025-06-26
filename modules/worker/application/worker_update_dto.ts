import { z } from "zod"
import {
  userResponseSchema
}            from "@/modules/user/application/user_response"
import {
  nationalIdentifierSchema
}            from "@/modules/national_identity/application/national_identity_dto"

export const workerUpdateSchema = z.object( {
  user          : userResponseSchema,
  description   : z.string().optional(),
  review_count  : z.number().optional(),
  review_average: z.number().optional(),
  status        : z.string().optional(),
  location      : z.string().optional(),
  verified      : z.boolean().optional()
} )

export type WorkerUpdateDTO = z.infer<typeof workerUpdateSchema>

