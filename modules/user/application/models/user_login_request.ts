import { z }              from "zod"
import { passwordSchema } from "@/modules/user/domain/password"

export const userLoginRequestSchema = z.object( {
  email   : z.string().email(),
  password: passwordSchema
} )

export type UserLoginRequest = z.infer<typeof userLoginRequestSchema>
