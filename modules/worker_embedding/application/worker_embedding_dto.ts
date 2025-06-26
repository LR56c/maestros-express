import { z }           from "zod"
import {
  workerResponseSchema
}                      from "@/modules/worker/application/worker_response"
import { storySchema } from "@/modules/story/application/story_dto"
import {
  WorkerEmbeddingTypeEnum
} from "@/modules/worker_embedding/domain/worker_embedding_type"

const workEmbedSchema = workerResponseSchema.extend( {
  type: z.literal( WorkerEmbeddingTypeEnum.WORKER )
} )

const storyEmbedSchema = storySchema.extend( {
  type: z.literal( WorkerEmbeddingTypeEnum.STORY )
} )

export const workerEmbeddingSchema = z.object( {
  id  : z.string(),
  data: z.discriminatedUnion( "type",
    [workEmbedSchema, storyEmbedSchema] )
} )

export type WorkerEmbeddingDTO = z.infer<typeof workerEmbeddingSchema>

