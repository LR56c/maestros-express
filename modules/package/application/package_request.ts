import { z } from "zod"
import {
  packageDocumentSchema
}            from "@/modules/package/modules/package_document/application/package_document_dto"

export const packageRequestSchema = z.object( {
  id           : z.string(),
  worker_id    : z.string(),
  name         : z.string(),
  description  : z.string(),
  specification: z.string(),
  value        : z.number(),
  cover_url    : z.string(),
  value_format : z.string(),
  documents    : z.array( packageDocumentSchema )
} )

export type PackageRequest = z.infer<typeof packageRequestSchema>

