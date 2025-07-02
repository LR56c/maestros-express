import { z }              from "zod"
import { passwordSchema } from "../domain/password"

export const authRegisterRequestSchema = z.object( {
  email            : z.string(),
  name            : z.string(),
  password: passwordSchema
} )

export type AuthRegisterRequest = z.infer<typeof authRegisterRequestSchema>
