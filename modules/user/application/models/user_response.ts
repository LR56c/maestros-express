import { z }          from "zod"

export const userResponseSchema = z.object( {
  user_id : z.string(),
  email   : z.string(),
  full_name    : z.string(),
  avatar  : z.string().optional(),
} )

export type UserResponse = z.infer<typeof userResponseSchema>
