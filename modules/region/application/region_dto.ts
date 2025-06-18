import { countrySchema } from "../../country/application/country_dto"
import { z }             from "zod"

export const regionSchema = z.object( {
  id     : z.string(),
  name   : z.string(),
  country: countrySchema
} )

export type RegionDTO = z.infer<typeof regionSchema>

