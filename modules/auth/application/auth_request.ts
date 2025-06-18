import { z }              from "zod"
import { passwordSchema } from "../domain/password"

export const authRequestSchema = z.object( {
  email            : z.string( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ).email( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ),
  password: passwordSchema
} )

export type AuthRequest = z.infer<typeof authRequestSchema>
