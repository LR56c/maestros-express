import { z } from "zod"
import {
  packageDocumentSchema
} from "@/modules/package/modules/package_document/application/package_document_dto"

export const packageResponseSchema = z.object( {
  id           : z.string(),
  name         : z.string(),
  description  : z.string(),
  specification: z.string(),
  value        : z.number(),
  review_count  : z.number(),
  review_average: z.number(),
  cover_url     : z.string(),
  value_format  : z.string(),
  documents: z.array( packageDocumentSchema),
  created_at    : z.string().datetime()
} )

export type PackageResponse = z.infer<typeof packageResponseSchema>

