import { z } from "zod"

export const validUploadDocumentSchema = z.object( {
  type  : z.string(),
  url   : z.string(),
  name  : z.string(),
  format: z.string()
} )

export type ValidUploadDocumentDTO = z.infer<typeof validUploadDocumentSchema>
