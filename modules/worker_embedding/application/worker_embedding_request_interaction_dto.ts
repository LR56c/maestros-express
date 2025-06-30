import { z } from "zod"


export const workerEmbeddingRequestInteractionDto = z.object( {
  info_text    : z.string().optional(),
  process_input: z.string()
} ).refine( data =>
    Object.values( data ).some( value => value !== undefined ),
  {
    message: "At least one field must be present"
  }
)

export type WorkerRequestInteractionDTO = z.infer<typeof workerEmbeddingRequestInteractionDto>

