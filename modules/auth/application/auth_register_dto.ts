import { z }              from "zod"
import { passwordSchema } from "../domain/password"

export const authRegisterSchema = z.object( {
  email: z.string( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ).email( {
    message: "Campo obligatorio. Ingrese un correo válido"
  } ),
  name: z.string( {
    message: "Campo obligatorio. Ingrese un nombre válido"
  } ).min( 1, {
    message: "Campo obligatorio. Ingrese un nombre válido"
  } ),
  password: passwordSchema
} )

export type AuthRegisterDTO = z.infer<typeof authRegisterSchema>
