import { z } from "zod"

export const workerEmbeddingResponseSchema = z.object( {
  id  : z.string(),
  worker_id  : z.string(),
  type  : z.string(),
} )

export type WorkerEmbeddingResponse = z.infer<typeof workerEmbeddingResponseSchema>

