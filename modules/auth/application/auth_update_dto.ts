import { z }          from "zod"
import { jsonSchema } from "@/modules/shared/application/json_schema"

export const authUpdateSchema = z.object( {
  email : z.string(),
  metadata: jsonSchema
} )

export type AuthUpdateDTO = z.infer<typeof authUpdateSchema>
