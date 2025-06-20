import { z }             from "zod"
import { countrySchema } from "@/modules/country/application/country_dto"

export const nationalIdentifierSchema = z.object( {
  id        : z.string(),
  identifier: z.string(),
  type      : z.string(),
  country   : countrySchema
} )

export type NationalIdentifierDTO = z.infer<typeof nationalIdentifierSchema>

