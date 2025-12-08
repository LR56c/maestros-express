import { z } from "zod"
import {
  packageDocumentSchema
}            from "@/modules/package/modules/package_document/application/package_document_dto"

export const packageUpdateSchema = z.object( {
  id           : z.string(),
  name         : z.string().nullish(),
  description  : z.string().nullish(),
  specification: z.string().nullish(),
  value        : z.number().nullish(),
  review_count  : z.number().nullish(),
  review_average: z.number().nullish(),
  cover_url     : z.string().nullish(),
  value_format  : z.string().nullish(),
  documents: z.array( packageDocumentSchema).nullish(),
} )

export type PackageUpdateDTO = z.infer<typeof packageUpdateSchema>

