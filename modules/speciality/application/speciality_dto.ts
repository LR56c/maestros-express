import { z } from "zod"

export const specialitySchema = z.object( {
  id          : z.string(),
  name          : z.string(),
} )

export type SpecialityDTO = z.infer<typeof specialitySchema>

