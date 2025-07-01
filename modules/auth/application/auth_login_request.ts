import { z }              from "zod"
import { passwordSchema } from "../domain/password"

export const authLoginRequestSchema = z.object( {
  email            : z.string( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ).email( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ),
  password: passwordSchema
} )

export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>
