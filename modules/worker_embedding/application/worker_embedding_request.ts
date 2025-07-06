import { z }           from "zod"
import {
  workerResponseSchema
}                      from "@/modules/worker/application/worker_response"
import { storySchema } from "@/modules/story/application/story_dto"
import {
  WorkerEmbeddingTypeEnum
}                      from "@/modules/worker_embedding/domain/worker_embedding_type"
import { latLngSchema } from "@/modules/shared/domain/value_objects/position"

const workEmbedSchema = workerResponseSchema.extend( {
  type: z.literal( WorkerEmbeddingTypeEnum.WORKER )
} )
export type WorkerEmbedRequest = z.infer<typeof workEmbedSchema>

const storyEmbedSchema = storySchema.extend( {
  type: z.literal( WorkerEmbeddingTypeEnum.STORY )
} )
export type StoryEmbedRequest = z.infer<typeof storyEmbedSchema>

export const workerEmbeddingRequestSchema = z.object( {
  id      : z.string(),
  location: z.string(),
  data    : z.discriminatedUnion( "type", [workEmbedSchema, storyEmbedSchema] )
} )

export type WorkerEmbeddingRequest = z.infer<typeof workerEmbeddingRequestSchema>

