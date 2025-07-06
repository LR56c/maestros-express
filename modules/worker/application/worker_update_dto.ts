import { z }                  from "zod"
import {
  specialitySchema
}                             from "@/modules/speciality/application/speciality_dto"
import {
  userResponseSchema
}                             from "@/modules/user/application/models/user_response"

export const workerUpdateSchema = z.object( {
  user          : userResponseSchema,
  description   : z.string().optional(),
  review_count  : z.number().optional(),
  review_average: z.number().optional(),
  status        : z.string().optional(),
  location      : z.string().optional(),
  verified      : z.boolean().optional(),
  specialities: z.union( [z.array( specialitySchema ).optional(), z.null()] )
} )

export type WorkerUpdateDTO = z.infer<typeof workerUpdateSchema>

