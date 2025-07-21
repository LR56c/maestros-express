import { z } from "zod"

export const countrySchema = z.object( {
  id  : z.string(),
  name: z.string({
    message: "Nombre del país es requerido"
  }),
  code: z.string({
    message: "Código del país es requerido"
  })
} )

export type CountryDTO = z.infer<typeof countrySchema>
