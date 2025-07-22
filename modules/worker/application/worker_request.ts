import { z }                           from "zod"
import {
  userRegisterRequestSchema
}                                      from "@/modules/user/application/models/user_register_request"
import {
  latLngSchema
}                                      from "@/modules/shared/domain/value_objects/position"
import { differenceInYears, parseISO } from "date-fns"

const eighteenYearsAgo = new Date()
eighteenYearsAgo.setFullYear( eighteenYearsAgo.getFullYear() - 18 )
export const workerRequestSchema = z.object( {
  user                   : userRegisterRequestSchema,
  avatar                 : z.string(),
  national_identity_id   : z.string(),
  national_identity_value: z.string(),
  birth_date             : z.string().date().refine(
    ( dobString ) => {
      const dob       = parseISO( dobString )
      const yearsDiff = differenceInYears( new Date(), dob )
      return yearsDiff >= 18
    },
    {
      message: "Debes tener al menos 18 años de edad."
    }
  ),
  description            : z.string().optional(),
  location               : latLngSchema
} )

export type WorkerRequest = z.infer<typeof workerRequestSchema>

