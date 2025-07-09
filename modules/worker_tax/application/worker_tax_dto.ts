import { z } from "zod"

export const workerTaxSchema = z.object( {
  id          : z.string(),
  name        : z.string(),
  value       : z.coerce.number().int(),
  value_format: z.string()
} )

export type WorkerTaxDTO = z.infer<typeof workerTaxSchema>

