import { z } from "zod"

export const userResetSchema = z.object( {
  method: z.string(),
  data  : z.string().nullish()
} )

export type UserResetDTO = z.infer<typeof userResetSchema>
