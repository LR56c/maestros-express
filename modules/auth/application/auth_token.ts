import { z } from "zod"

export const authTokenSchema = z.object( {
  user_id: z.string(),
  email  : z.string(),
  ac     : z.string(),
  rf     : z.string()
} )

export type AuthToken = z.infer<typeof authTokenSchema>
