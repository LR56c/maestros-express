import { z }          from "zod"
import { jsonSchema } from "@/modules/shared/application/json_schema"

export const authResponseSchema = z.object( {
  user_id : z.string(),
  email   : z.string(),
  method  : z.string(),
  name    : z.string().optional(),
  metadata: jsonSchema
} )

export type AuthResponse = z.infer<typeof authResponseSchema>
