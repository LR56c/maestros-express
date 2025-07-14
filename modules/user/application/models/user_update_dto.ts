import { z } from "zod"

export const userUpdateSchema = z.object( {
  email : z.string().email(),
  avatar: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
} )

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>
