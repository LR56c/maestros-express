import { z } from "zod"

export const validFileSchema = z.object( {
  type  : z.string(),
  format: z.string(),
  file  : z.instanceof( File ),
} )

export type ValidFIleDTO = z.infer<typeof validFileSchema>
