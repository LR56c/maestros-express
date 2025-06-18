import { z } from "zod"

export const roleSchema = z.object( {
  name: z.string()
} )

export type RoleDTO = z.infer<typeof roleSchema>
