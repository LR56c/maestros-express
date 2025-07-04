import { z }              from "zod"
import { passwordSchema } from "@/modules/user/domain/password"

export const userRegisterRequestSchema = z.object( {
  email            : z.string(),
  full_name            : z.string(),
  avatar  : z.string().optional(),
  password: passwordSchema
} )

export type UserRegisterRequest = z.infer<typeof userRegisterRequestSchema>
