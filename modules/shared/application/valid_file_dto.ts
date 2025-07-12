import { z } from "zod"

export const validFileSchema = z.object( {
  type  : z.string(),
  file  : z.instanceof( File ),
} )

export type ValidFileDTO = z.infer<typeof validFileSchema>
