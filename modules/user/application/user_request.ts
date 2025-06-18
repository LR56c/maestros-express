import { z } from "zod"

export const userRequestSchema = z.object( {
  user_id: z.string().uuid(),
  email   : z.string().email(),
  name   : z.string(),
  surname   : z.string(),
  avatar   : z.string().optional(),
  roles  : z.array( z.string() )
} )

export type UserRequest = z.infer<typeof userRequestSchema>
