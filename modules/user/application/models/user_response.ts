import { z } from "zod"

export const userResponseSchema = z.object( {
  user_id  : z.string(),
  email    : z.string().email(),
  full_name: z.string(),
  username: z.string(),
  role     : z.string(),
  status   : z.string(),
  avatar   : z.string().nullish()
} )

export type UserResponse = z.infer<typeof userResponseSchema>
