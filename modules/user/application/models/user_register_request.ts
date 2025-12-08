import { z }              from "zod"
import { passwordSchema } from "@/modules/user/domain/password"

export const userRegisterRequestSchema = z.object( {
  email    : z.string().email(),
  full_name: z.string(),
  username : z.string(),
  avatar   : z.string().nullish(),
  password : passwordSchema
} )

export type UserRegisterRequest = z.infer<typeof userRegisterRequestSchema>
