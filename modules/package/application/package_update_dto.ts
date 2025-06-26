import { z } from "zod"
import {
  packageDocumentSchema
} from "@/modules/package/modules/package_document/application/package_document_dto"

export const packageUpdateSchema = z.object( {
  id           : z.string(),
  name         : z.string().optional(),
  description  : z.string().optional(),
  specification: z.string().optional(),
  value        : z.number().optional(),
  review_count  : z.number().optional(),
  review_average: z.number().optional(),
  cover_url     : z.string().optional(),
  value_format  : z.string().optional(),
  documents: z.array( packageDocumentSchema).optional(),
} )

export type PackageUpdateDTO = z.infer<typeof packageUpdateSchema>

