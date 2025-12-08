import { z }             from "zod"
import { countrySchema } from "@/modules/country/application/country_dto"

export const phoneFormatSchema = z.object( {
  id     : z.string(),
  example: z.string().nullish(),
  regex  : z.string(),
  prefix  : z.string(),
  country: countrySchema
} )

export type PhoneFormatDTO = z.infer<typeof phoneFormatSchema>

