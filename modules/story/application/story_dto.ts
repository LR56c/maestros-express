import { z } from "zod"
import {
  storyDocumentSchema
}            from "@/modules/story/modules/story_document/application/story_document_dto"

export const storySchema = z.object( {
  id         : z.string(),
  name       : z.string(),
  description: z.string(),
  documents  : z.array( storyDocumentSchema )
} )

export type StoryDTO = z.infer<typeof storySchema>

