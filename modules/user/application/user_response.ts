import { z }          from "zod"
import { roleSchema } from "@/modules/role/application/role_dto"

export const userResponseSchema = z.object( {
  user_id   : z.string().uuid(),
  email   : z.string().email(),
  name   : z.string(),
  surname   : z.string(),
  avatar      : z.string().optional(),
  roles     : z.array( roleSchema )
} )

export type UserResponse = z.infer<typeof userResponseSchema>
