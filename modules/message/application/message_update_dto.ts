import { z } from "zod"

export const messageUpdateSchema = z.object( {
  id        : z.string(),
  status      : z.string(),
} )

export type MessageUpdateDTO = z.infer<typeof messageUpdateSchema>

