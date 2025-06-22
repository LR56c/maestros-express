import { z } from "zod"

export const storyDocumentSchema = z.object( {
  id          : z.string(),
  url          : z.string(),
  type          : z.string(),
} )

export type StoryDocumentDTO = z.infer<typeof storyDocumentSchema>

