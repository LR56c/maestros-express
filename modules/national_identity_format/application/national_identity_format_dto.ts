import { z }             from "zod"
import { countrySchema } from "@/modules/country/application/country_dto"
import {
  ensureRegexAnchors,
  removeDoubleEscape
} from "@/modules/shared/utils/ensure_regex"

export const nationalIdentityFormatSchema = z.object( {
  id     : z.string(),
  name   : z.string().min( 1, "Required" ),
  regex  : z.string().transform(val => ensureRegexAnchors(removeDoubleEscape(val))),
  country: countrySchema
} )

export type NationalIdentityFormatDTO = z.infer<typeof nationalIdentityFormatSchema>
