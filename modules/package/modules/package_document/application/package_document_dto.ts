import { z } from "zod"

export const packageDocumentSchema = z.object( {
  id          : z.string(),
  url          : z.string(),
  type          : z.string(),
} )

export type PackageDocumentDTO = z.infer<typeof packageDocumentSchema>

