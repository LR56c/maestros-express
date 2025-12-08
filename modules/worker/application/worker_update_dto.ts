import { z } from "zod"
import {
  specialitySchema
}            from "@/modules/speciality/application/speciality_dto"
import {
  userResponseSchema
}            from "@/modules/user/application/models/user_response"

export const workerUpdateSchema = z.object( {
  user          : userResponseSchema,
  description   : z.string().nullish(),
  review_count  : z.number().nullish(),
  review_average: z.number().nullish(),
  status        : z.string().nullish(),
  location      : z.string().nullish(),
  verified      : z.boolean().nullish(),
  embedding     : z.boolean().default(true),
  specialities  : z.union( [z.array( specialitySchema ).nullish(), z.null()] )
} )
export type WorkerUpdateDTO = z.infer<typeof workerUpdateSchema>
